import { db } from '@/drizzle/db';
import { articlesSchema } from '@/drizzle/schemas';
import articlesJson from '@/scripts/db/articles/seed/articles.json';

type Article = typeof articlesSchema.$inferInsert;

export async function seedArticles() {
  console.debug('seeding articles');
  const articles = await fetchArticles();
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]!;
    console.debug(`seeding article ${i + 1} of ${articles.length}: ${article.slug}`);
    await db.insert(articlesSchema).values(article).onConflictDoNothing();
  }
  console.debug('done seeding articles');
}

async function fetchArticles(): Promise<Article[]> {
  const thumbnailUrl = 'https://picsum.photos/900/1269';
  const fullText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const articles = articlesJson.map(a => {
    const name = a.text;
    const slug = a.href.split('/').pop();
    const tags = getTags(name);
    return { name, slug, thumbnailUrl, fullText, tags, srcUrl: a.href } as Article;
  });
  return articles;
}

function getTags(name: string): string[] {
  if (name.startsWith('F')) {
    return ['QSOURCE FOUNDATION'];
  }
  if (name.startsWith('Q1')) {
    return ['FIRST QUADRANT (Q1) Get Right'];
  }
  if (name.startsWith('Q2')) {
    return ['SECOND QUADRANT (Q2) Live Right'];
  }
  if (name.startsWith('Q3')) {
    return ['THIRD QUADRANT (Q3) Lead Right'];
  }
  if (name.startsWith('Q4')) {
    return ['FOURTH QUADRANT (Q4) LEAVE RIGHT'];
  }
  return [''];
}
