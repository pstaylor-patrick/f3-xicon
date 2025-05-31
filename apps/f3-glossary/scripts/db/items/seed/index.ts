import { db } from '@/drizzle/db';
import { itemsSchema } from '@/drizzle/schemas';

export async function seedItems() {
  await db
    .insert(itemsSchema)
    .values([
      {
        slug: 'item-1',
        name: 'Item 1',
        description: 'This is the description of item 1',
        tags: ['tag1', 'tag2'],
      },
      {
        slug: 'item-2',
        name: 'Item 2',
        description: 'This is the description of item 2',
        tags: ['tag3', 'tag4'],
      },
      {
        slug: 'item-3',
        name: 'Item 3',
        description: 'This is the description of item 3',
        tags: ['tag5', 'tag6'],
      },
      {
        slug: 'item-4',
        name: 'Item 4',
        description: 'This is the description of item 4',
        tags: ['tag7', 'tag8'],
      },
      {
        slug: 'item-5',
        name: 'Item 5',
        description: 'This is the description of item 5',
        tags: ['tag9', 'tag10'],
      },
    ])
    .onConflictDoNothing();
}
