import { db } from '@/drizzle/db';
import { articlesSchema } from '@/drizzle/schemas';

export async function seedArticles() {
  await db
    .insert(articlesSchema)
    .values([
      {
        slug: 'article-1',
        name: 'Article 1',
        thumbnailUrl: 'https://example.com/thumbnail-1.jpg',
        fullText: 'This is the full text of article 1',
        tags: ['tag1', 'tag2'],
        srcUrl: 'https://example.com/article-1',
      },
      {
        slug: 'article-2',
        name: 'Article 2',
        thumbnailUrl: 'https://example.com/thumbnail-2.jpg',
        fullText: 'This is the full text of article 2',
        tags: ['tag3', 'tag4'],
        srcUrl: 'https://example.com/article-2',
      },
      {
        slug: 'article-3',
        name: 'Article 3',
        thumbnailUrl: 'https://example.com/thumbnail-3.jpg',
        fullText: 'This is the full text of article 3',
        tags: ['tag5', 'tag6'],
        srcUrl: 'https://example.com/article-3',
      },
      {
        slug: 'article-4',
        name: 'Article 4',
        thumbnailUrl: 'https://example.com/thumbnail-4.jpg',
        fullText: 'This is the full text of article 4',
        tags: ['tag7', 'tag8'],
        srcUrl: 'https://example.com/article-4',
      },
      {
        slug: 'article-5',
        name: 'Article 5',
        thumbnailUrl: 'https://example.com/thumbnail-5.jpg',
        fullText: 'This is the full text of article 5',
        tags: ['tag9', 'tag10'],
        srcUrl: 'https://example.com/article-5',
      },
    ])
    .onConflictDoNothing();
}
