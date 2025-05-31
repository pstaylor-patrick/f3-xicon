import { db } from '@/drizzle/db';
import { regionsSchema } from '@/drizzle/schemas';

export async function seedRegions() {
  await db
    .insert(regionsSchema)
    .values([
      {
        slug: 'region-1',
        name: 'Region 1',
        tags: ['tag1', 'tag2'],
        city: 'City 1',
        state: 'State 1',
        country: 'Country 1',
        regionPageUrl: 'https://example.com/region-1',
        mapUrl: 'https://example.com/map-1',
      },
      {
        slug: 'region-2',
        name: 'Region 2',
        tags: ['tag3', 'tag4'],
        city: 'City 2',
        state: 'State 2',
        country: 'Country 2',
        regionPageUrl: 'https://example.com/region-2',
        mapUrl: 'https://example.com/map-2',
      },
      {
        slug: 'region-3',
        name: 'Region 3',
        tags: ['tag5', 'tag6'],
        city: 'City 3',
        state: 'State 3',
        country: 'Country 3',
        regionPageUrl: 'https://example.com/region-3',
        mapUrl: 'https://example.com/map-3',
      },
      {
        slug: 'region-4',
        name: 'Region 4',
        tags: ['tag7', 'tag8'],
        city: 'City 4',
        state: 'State 4',
        country: 'Country 4',
        regionPageUrl: 'https://example.com/region-4',
        mapUrl: 'https://example.com/map-4',
      },
      {
        slug: 'region-5',
        name: 'Region 5',
        tags: ['tag9', 'tag10'],
        city: 'City 5',
        state: 'State 5',
        country: 'Country 5',
        regionPageUrl: 'https://example.com/region-5',
        mapUrl: 'https://example.com/map-5',
      },
    ])
    .onConflictDoNothing();
}
