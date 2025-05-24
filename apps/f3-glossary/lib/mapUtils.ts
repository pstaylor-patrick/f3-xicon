// adapted from https://github.com/F3-Nation/f3-region-pages/blob/a5d57ba/src/utils/mapUtils.ts

export const MAP_CONSTANTS = {
  EARTH_RADIUS_KM: 6371,
  ZOOM_LEVELS: {
    NEIGHBORHOOD: { distance: 5, zoom: 13 as number },
    SMALL_CITY: { distance: 15, zoom: 12 as number },
    LARGE_CITY: { distance: 30, zoom: 11 as number },
    METROPOLITAN: { distance: 60, zoom: 10 as number },
    REGIONAL: { distance: 100, zoom: 9 as number },
    WIDE_REGIONAL: { zoom: 8 as number },
  },
  DEFAULT_PARAMS: {
    lat: 0,
    lon: 0,
    zoom: 12,
  },
} as const;

export interface MapParameters {
  lat: number;
  lng: number;
  zoom: number;
}

/**
 * Calculates the haversine distance between two points on Earth
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * MAP_CONSTANTS.EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type LatLng = { lat: string; lng: string };

/**
 * Generates a URL for the F3 Nation map with the given parameters
 * @param params Object containing latitude, longitude, and zoom level
 * @returns URL string for the F3 Nation map
 */
export function getMapUrl(regionName: string, latLngByRegion: Record<string, LatLng[]>): string {
  const { lat, lng, zoom } = calculateMapParameters(latLngByRegion[regionName]);
  const baseUrl = 'https://map.f3nation.com';

  // F3 Nation map uses a simple URL structure
  return `${baseUrl}/?lat=${lat}&lon=${lng}&zoom=${zoom}`;
}

/**
 * Calculates map parameters (center point and zoom level) based on workout locations
 * @param workouts Array of workout locations
 * @returns Object containing latitude, longitude, and zoom level
 */
export function calculateMapParameters(workouts: LatLng[]): MapParameters {
  // Default to a central US location if no workouts
  if (!workouts.length) {
    return {
      lat: 39.8283,
      lng: -98.5795,
      zoom: 4,
    };
  }

  const markers = workouts.map(workout => ({
    lat: parseFloat(workout.lat),
    lng: parseFloat(workout.lng),
  }));

  // Calculate bounds
  const lats = markers.map(m => m.lat);
  const lngs = markers.map(m => m.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Add padding to the bounds (about 20% on each side)
  const latPadding = (maxLat - minLat) * 0.2;
  const lngPadding = (maxLng - minLng) * 0.2;
  const paddedMinLat = minLat - latPadding;
  const paddedMaxLat = maxLat + latPadding;
  const paddedMinLng = minLng - lngPadding;
  const paddedMaxLng = maxLng + lngPadding;

  // Calculate center using padded bounds
  const lat = (paddedMinLat + paddedMaxLat) / 2;
  const lng = (paddedMinLng + paddedMaxLng) / 2;

  // Calculate appropriate zoom level with adjusted formula
  const latDiff = paddedMaxLat - paddedMinLat;
  const lngDiff = paddedMaxLng - paddedMinLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // Adjust zoom calculation to be less aggressive
  // Start at zoom level 15 and subtract based on the size of the area
  const _zoom = Math.floor(15.5 - Math.log2(maxDiff * 111)); // 111km per degree at equator
  const zoom = Math.min(Math.max(_zoom, 4), 13); // Clamp between 4 and 13

  return {
    lat,
    lng,
    zoom,
  };
}
