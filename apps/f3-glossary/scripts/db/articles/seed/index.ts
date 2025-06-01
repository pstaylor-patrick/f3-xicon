import { db } from '@/drizzle/db';
import { articlesSchema } from '@/drizzle/schemas';
import axios from 'axios';
import * as cheerio from 'cheerio';

type Article = typeof articlesSchema.$inferInsert;

export async function seedArticles() {
  const articles = await fetchArticles();
  console.debug('seeding articles');
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]!;
    console.debug(`seeding article ${i + 1} of ${articles.length}: ${article.slug}`);
    await db.insert(articlesSchema).values(article).onConflictDoNothing();
  }
  console.debug('done seeding articles');
}

async function fetchArticles(): Promise<Article[]> {
  console.debug('fetching articles');
  const url = 'https://f3nation.com/q-source-index';
  const $ = await fetchPage(url);
  const articles: Article[] = [];
  const thumbnailUrl = 'https://picsum.photos/900/1269';
  const fullText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  $('#col-IxhDWZ7b5S a').each((_, element) => {
    const linkText = $(element).text().trim();
    if (linkText === 'GRID VIEW') {
      return;
    }
    const href = $(element).attr('href') || '';
    const article = {
      name: linkText,
      slug: href.split('/').pop()!,
      thumbnailUrl,
      fullText,
      tags: getTags(linkText),
      srcUrl: href,
    } as Article;
    articles.push(article);
  });
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]!;
    console.debug(`fetching article ${i + 1} of ${articles.length}: ${article.slug}`);
    const articlePage = await fetchPage(article.srcUrl);
    // document.querySelectorAll('.hl-image-picture')[1].querySelector('img').src
    const thumbnailUrl = articlePage('.hl-image-picture img').eq(1).attr('src') || '';
    article.thumbnailUrl = thumbnailUrl;
    const fullText = articlePage('h1,h2,p:not(li > p)')
      .map((_, el) => {
        const text = $(el).text().trim();
        if (text.length === 0) {
          return null;
        }
        const excludes = [
          'We use cookies to improve your experience on our site',
          'Submit Facebook Instagram X',
        ];
        for (const exclude of excludes) {
          if (text.startsWith(exclude)) {
            return null;
          }
        }
        return text;
      })
      .get()
      .join('\n\n');
    article.fullText = fullText.split('updated: 202')[0]; //.split('Start Here\n\nFind Location\n\nCulture')[0];
  }
  console.debug('done fetching articles');
  return articles;
}

/**
 * Fetches the HTML of a page and returns Cheerio's parsed document.
 */
async function fetchPage(url: string): Promise<cheerio.CheerioAPI> {
  const response = await axios.get(url, {
    headers: {
      // Some sites block unknown clients; set a common User-Agent.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    },
  });
  return cheerio.load(response.data);
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
