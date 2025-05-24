'use server';

import type { Region } from '@/types';

const GOOGLE_SHEETS_JSON_URL_POINTS =
  'https://sheets.googleapis.com/v4/spreadsheets/1lfbDLW4aj_BJgEzX6A0AoTWb33BYIskko5ggjffOrrg/values/Points?key=AIzaSyCUFLnGh5pHkqh3TjPsJD-8hOZwGlxvRwQ';
const COL_NAME_REGION = 'Region';
const COL_NAME_LOCATION = 'Location';

export async function getRegions(): Promise<Region[]> {
  const res = await fetch(GOOGLE_SHEETS_JSON_URL_POINTS);
  const pointsRes = (await res.json()) as PointsResponse;
  const colNumRegion = pointsRes.values[0].findIndex(colName => colName === COL_NAME_REGION);
  const regionNames = [...new Set(pointsRes.values.slice(1).map(p => p[colNumRegion]))];
  const colNumLocation = pointsRes.values[0].findIndex(colName => colName === COL_NAME_LOCATION);
  const locationsByRegion = pointsRes.values
    .slice(1)
    .reduce<Record<string, string[]>>((acc, row) => {
      const region = row[colNumRegion];
      const location = row[colNumLocation];
      if (!region || !location) return acc;
      if (!acc[region]) acc[region] = [];
      acc[region].push(location);
      return acc;
    }, {});
  const regions: Region[] = [];

  for (let i = 0; i < regionNames.length; i++) {
    const regionName = regionNames[i];
    const { city, state } = getLocation(regionName, locationsByRegion);

    const region: Region = {
      slug: toKebabCase(regionName),
      name: regionName,
      city: city,
      state: state,
    };
    regions.push(region);
  }
  return regions;
}

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
