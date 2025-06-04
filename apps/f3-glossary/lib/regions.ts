'use server';

import { regionsSchema } from '@/drizzle/schemas';
import { db } from '@/drizzle/db';
import { asc, eq } from 'drizzle-orm';
import type { LatLng } from '@/lib/mapUtils';
import { haversineDistance } from '@/lib/mapUtils';

export type Region = typeof regionsSchema.$inferSelect;

export async function getRegions(latLng?: LatLng): Promise<Region[]> {
  const allRegions = await db.select().from(regionsSchema).orderBy(asc(regionsSchema.name));
  if (latLng) {
    const regionsNearMe = allRegions.filter(
      region => haversineDistance({ lat: region.lat, lng: region.lng }, latLng) <= 50
    );
    regionsNearMe.sort((a, b) => {
      const latLngA = { lat: a.lat, lng: a.lng } as LatLng;
      const latLngB = { lat: b.lat, lng: b.lng } as LatLng;
      return haversineDistance(latLngA, latLng) - haversineDistance(latLngB, latLng);
    });
    return regionsNearMe;
  }
  return allRegions;
}

export async function getRegionBySlug(slug: string): Promise<Region | undefined> {
  const [region] = await db
    .select()
    .from(regionsSchema)
    .where(eq(regionsSchema.slug, slug))
    .limit(1);
  return region;
}
