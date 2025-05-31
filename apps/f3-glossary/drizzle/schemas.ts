import { pgTable, timestamp, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/** covers both exercises and terms */
export const itemsSchema = pgTable('items', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
