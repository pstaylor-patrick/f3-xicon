import { db } from '@/drizzle/db';
import { itemsSchema } from '@/drizzle/schemas';

export async function seedItems() {
  await db
    .insert(itemsSchema)
    .values([
      {
        slug: 'exercise-1',
        type: 'exercise',
        name: 'Exercise 1',
        description: 'This is the description of exercise 1',
        tags: ['tag1', 'tag2'],
      },
      {
        slug: 'exercise-2',
        type: 'exercise',
        name: 'Exercise 2',
        description: 'This is the description of exercise 2',
        tags: ['tag3', 'tag4'],
      },
      {
        slug: 'exercise-3',
        type: 'exercise',
        name: 'Exercise 3',
        description: 'This is the description of exercise 3',
        tags: ['tag5', 'tag6'],
      },
      {
        slug: 'exercise-4',
        type: 'exercise',
        name: 'Exercise 4',
        description: 'This is the description of exercise 4',
        tags: ['tag7', 'tag8'],
      },
      {
        slug: 'exercise-5',
        type: 'exercise',
        name: 'Exercise 5',
        description: 'This is the description of exercise 5',
        tags: ['tag9', 'tag10'],
      },
      {
        slug: 'term-1',
        type: 'term',
        name: 'Term 1',
        description: 'This is the description of term 1',
        tags: ['tag11', 'tag12'],
      },
      {
        slug: 'term-2',
        type: 'term',
        name: 'Term 2',
        description: 'This is the description of term 2',
        tags: ['tag13', 'tag14'],
      },
      {
        slug: 'term-3',
        type: 'term',
        name: 'Term 3',
        description: 'This is the description of term 3',
        tags: ['tag15', 'tag16'],
      },
      {
        slug: 'term-4',
        type: 'term',
        name: 'Term 4',
        description: 'This is the description of term 4',
        tags: ['tag17', 'tag18'],
      },
      {
        slug: 'term-5',
        type: 'term',
        name: 'Term 5',
        description: 'This is the description of term 5',
        tags: ['tag19', 'tag20'],
      },
    ])
    .onConflictDoNothing();
}
