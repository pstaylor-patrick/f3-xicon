'use server';

import { db } from '@/drizzle/db';
import { itemsSchema } from '@/drizzle/schemas';
import { asc, eq } from 'drizzle-orm';

export type Item = typeof itemsSchema.$inferSelect;

export async function getItems(type?: 'exercise' | 'term') {
  const items = await db
    .select()
    .from(itemsSchema)
    .where(type ? eq(itemsSchema.type, type) : undefined)
    .orderBy(asc(itemsSchema.name));
  return items;
}

export async function getItemBySlug(slug: string) {
  const [item] = await db.select().from(itemsSchema).where(eq(itemsSchema.slug, slug)).limit(1);
  return item;
}
