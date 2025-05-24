'use server';

import type { Region } from '@/types';
import type { LatLng } from './mapUtils';
import { getMapUrl } from './mapUtils';

const GOOGLE_SHEETS_JSON_URL_POINTS =
  'https://sheets.googleapis.com/v4/spreadsheets/1lfbDLW4aj_BJgEzX6A0AoTWb33BYIskko5ggjffOrrg/values/Points?key=AIzaSyCUFLnGh5pHkqh3TjPsJD-8hOZwGlxvRwQ';

export async function getRegions(): Promise<Region[]> {
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
    const { city, state } = getLocation(name, locationsByRegion);
    const mapUrl = getMapUrl(name, latLngByRegion);
    const slug = toKebabCase(name);
    const websiteUrl = `https://freemensworkout.org/regions/${slug}`;

    const region: Region = {
      slug,
      name,
      city,
      state,
      websiteUrl,
      mapUrl,
    };
    regions.push(region);
  }
  return regions;
}

const getPoints = async () => {
  const res = await fetch(GOOGLE_SHEETS_JSON_URL_POINTS);
  const pointsRes = (await res.json()) as PointsResponse;
  return pointsRes;
};

type ColNums = {
  region: number;
  location: number;
  lat: number;
  lng: number;
};

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

const toKebabCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

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
    ...new Set(locationsByRegion[regionName].map(location => extractCityState(location))),
  ];
  const location = locations[0].split(',');
  return {
    city: location[0].trim(),
    state: location[1].trim(),
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
const extractCityState = (location: string) => {
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

  return `${city}, ${state}`;
};

// --- raw response from your fetch ---
export interface PointsResponse {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: string[][];
}

// --- tuple type for each data row (after the header row) ---
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

// --- convenient object form (with numeric coords) ---
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
