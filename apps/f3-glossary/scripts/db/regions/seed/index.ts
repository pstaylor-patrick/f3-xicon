import { db } from '@/drizzle/db';
import { regionsSchema } from '@/drizzle/schemas';
import type { LatLng } from '@/lib/mapUtils';
import { getMapUrl } from '@/lib/mapUtils';
import { kebabCase } from 'lodash';

const GOOGLE_SHEETS_JSON_URL_POINTS =
  'https://sheets.googleapis.com/v4/spreadsheets/1lfbDLW4aj_BJgEzX6A0AoTWb33BYIskko5ggjffOrrg/values/Points?key=AIzaSyCUFLnGh5pHkqh3TjPsJD-8hOZwGlxvRwQ';

export async function seedRegions() {
  console.debug('seeding regions');
  const regions = await fetchRegions();
  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    console.debug(`seeding region ${i + 1} of ${regions.length}: ${region.slug}`);
    await db.insert(regionsSchema).values(region).onConflictDoNothing();
  }
  console.debug('done seeding regions');
}

async function fetchRegions(): Promise<Region[]> {
  const points = await getPoints();
  const header = points.values[0];
  const rows = points.values.slice(1);
  const colNums = getColNums(header);
  const regionNames = [...new Set(rows.map(row => row[colNums.region]))];
  const locationsByRegion = getLocationsByRegion(rows, colNums);
  const latLngByRegion = getLatLngByRegion(rows, colNums);
  const regions: Region[] = [];

  for (let i = 0; i < regionNames.length; i++) {
    const name = regionNames[i];
    const { city, state, country } = getLocation(name, locationsByRegion);
    if (country !== 'United States') continue;
    const mapUrl = getMapUrl(name, latLngByRegion);
    const slug = kebabCase(name);
    const websiteUrl = `https://freemensworkout.org/regions/${slug}`;

    const region: Region = {
      slug,
      name,
      city,
      state,
      country,
      regionPageUrl: websiteUrl,
      mapUrl,
      tags: [],
    };
    regions.push(region);
  }
  regions.sort((a, b) => a.slug.localeCompare(b.slug));
  return regions;
}

type Region = typeof regionsSchema.$inferInsert;

async function getPoints(): Promise<PointsResponse> {
  const res = await fetch(GOOGLE_SHEETS_JSON_URL_POINTS);
  const pointsRes = (await res.json()) as PointsResponse;
  return pointsRes;
}

interface PointsResponse {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: string[][];
}

export type PointRow = [
  group: string,
  time: string,
  type: string,
  region: string,
  website: string,
  notes: string,
  markerIcon: string,
  markerColor: string,
  iconColor: string,
  customSize: string,
  name: string,
  image: string,
  description: string,
  location: string,
  latitude: string,
  longitude: string,
  entryId: string,
];

export interface Point {
  group: string;
  time: string;
  type: string;
  region: string;
  website: string;
  notes: string;
  markerIcon: string;
  markerColor: string;
  iconColor: string;
  customSize: string;
  name: string;
  image: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  entryId: string;
}

const getColNums = (header: string[]): ColNums => {
  const colNames = {
    region: 'Region',
    location: 'Location',
    lat: 'Latitude',
    lng: 'Longitude',
  };
  return {
    region: header.findIndex(colName => colName === colNames.region),
    location: header.findIndex(colName => colName === colNames.location),
    lat: header.findIndex(colName => colName === colNames.lat),
    lng: header.findIndex(colName => colName === colNames.lng),
  } as ColNums;
};

type ColNums = {
  region: number;
  location: number;
  lat: number;
  lng: number;
};

const getLocationsByRegion = (rows: string[][], colNums: ColNums) => {
  return rows.reduce<Record<string, string[]>>((acc, row) => {
    const region = row[colNums.region];
    const location = row[colNums.location];
    if (!region || !location) return acc;
    if (!acc[region]) acc[region] = [];
    acc[region].push(location);
    return acc;
  }, {});
};

const getLatLngByRegion = (rows: string[][], colNums: ColNums) => {
  return rows.reduce<Record<string, LatLng[]>>((acc, row) => {
    const region = row[colNums.region];
    const lat = row[colNums.lat];
    const lng = row[colNums.lng];
    if (!region || !lat || !lng) return acc;
    if (!acc[region]) acc[region] = [];
    acc[region].push({ lat, lng });
    return acc;
  }, {});
};

/**
 * TODO:
 * smarter location matching
 * when multiple locations exist
 * for any given region name
 * @param regionName
 * @param locationsByRegion
 * @returns
 */
const getLocation = (regionName: string, locationsByRegion: Record<string, string[]>) => {
  const locations = [
    ...new Set(locationsByRegion[regionName].map(location => extractCityStateCountry(location))),
  ];
  const location = locations[0].split(',');
  return {
    city: location[0].trim(),
    state: location[1].trim(),
    country: location[2]?.trim(),
  };
};

/**
 * Extracts just "City, State" from a full address string.
 *
 * Examples:
 *   "788 Beeson Rd, Kernersville, NC, 27284, United States" → "Kernersville, NC"
 *   "1111 Bord du Lac Dr, Lake Charles,, LA, 70601, United States" → "Lake Charles, LA"
 *
 * @param location - a comma-separated address string
 * @returns "City, State" or an empty string if it can't parse
 */
const extractCityStateCountry = (location: string) => {
  // Split on commas, trim whitespace, drop any empty segments
  const parts = location
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // We expect at least [street…, city, state, zip, country]
  if (parts.length < 4) {
    return '';
  }

  // City is the 4th-to-last segment, state is the 3rd-to-last
  const city = parts[parts.length - 4];
  const state = parts[parts.length - 3];
  const country = parts[parts.length - 1];

  return `${city}, ${state}, ${country}`;
};
