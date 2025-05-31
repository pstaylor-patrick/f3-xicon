'use server';

import { regionsSchema } from '@/drizzle/schemas';
import { db } from '@/drizzle/db';
import { asc, eq } from 'drizzle-orm';

export type Region = typeof regionsSchema.$inferSelect;

export async function getRegions(): Promise<Region[]> {
  const regions = await db.select().from(regionsSchema).orderBy(asc(regionsSchema.name));
  return regions;
}

export async function getRegionBySlug(slug: string): Promise<Region | undefined> {
  const [region] = await db
    .select()
    .from(regionsSchema)
    .where(eq(regionsSchema.slug, slug))
    .limit(1);
  return region;
}
