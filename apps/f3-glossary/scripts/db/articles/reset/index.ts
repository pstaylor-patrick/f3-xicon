import { db } from '@/drizzle/db';
import { articlesSchema } from '@/drizzle/schemas';

export async function resetArticles() {
  await db.delete(articlesSchema);
}
