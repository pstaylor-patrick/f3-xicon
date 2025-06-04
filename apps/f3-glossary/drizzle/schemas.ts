import { pgTable, timestamp, uuid, varchar, text, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { doublePrecision } from 'drizzle-orm/pg-core';

export const itemTypeEnum = pgEnum('item_type', ['exercise', 'term']);

export const itemsSchema = pgTable('items', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  type: itemTypeEnum('type').notNull(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: text('description').notNull(),
  tags: text('tags').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const articlesSchema = pgTable('articles', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 255 }).notNull(),
  fullText: text('full_text').notNull(),
  tags: text('tags').array().notNull(),
  srcUrl: varchar('src_url', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const regionsSchema = pgTable('regions', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  tags: text('tags').array().notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  regionPageUrl: varchar('region_page_url', { length: 255 }).unique().notNull(),
  mapUrl: varchar('map_url', { length: 255 }).unique().notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
