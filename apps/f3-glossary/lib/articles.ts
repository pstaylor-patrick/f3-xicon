'use server';

import { db } from '@/drizzle/db';
import { articlesSchema } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';

export type Article = typeof articlesSchema.$inferSelect;

export async function getArticles() {
  const articles = await db.select().from(articlesSchema);
  return articles;
}

export async function getArticleBySlug(slug: string) {
  const [article] = await db
    .select()
    .from(articlesSchema)
    .where(eq(articlesSchema.slug, slug))
    .limit(1);
  return article;
}
