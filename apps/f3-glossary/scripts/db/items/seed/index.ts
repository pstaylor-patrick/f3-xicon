import { db } from '@/drizzle/db';
import { itemsSchema } from '@/drizzle/schemas';
import { kebabCase } from 'lodash';

const LEXICON_GOOGLE_SHEETS_JSON_URL_ITEMS =
  'https://sheets.googleapis.com/v4/spreadsheets/176smbOvZkK5AJJR034ZEgtbbflIVqySAc4sy8aiK46Y/values/Lexicon?key=AIzaSyCUFLnGh5pHkqh3TjPsJD-8hOZwGlxvRwQ';
const EXICON_GOOGLE_SHEETS_JSON_URL_ITEMS =
  'https://sheets.googleapis.com/v4/spreadsheets/176smbOvZkK5AJJR034ZEgtbbflIVqySAc4sy8aiK46Y/values/Exicon?key=AIzaSyCUFLnGh5pHkqh3TjPsJD-8hOZwGlxvRwQ';

export async function seedItems() {
  console.debug('seeding items');
  const items = await fetchItems();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.debug(`seeding item ${i + 1} of ${items.length}: ${item.type}: ${item.slug}`);
    await db.insert(itemsSchema).values(item).onConflictDoNothing();
  }
  console.debug('done seeding items');
}

async function fetchItems(): Promise<Item[]> {
  const lexicon = await fetchLexicon();
  const exicon = await fetchExicon();
  return [...lexicon, ...exicon];
}

async function fetchLexicon(): Promise<Item[]> {
  const itemsRes = await fetch(LEXICON_GOOGLE_SHEETS_JSON_URL_ITEMS);
  const itemsJson = (await itemsRes.json()) as ItemsResponse;
  const items = itemsJson.values.slice(1).map(i => {
    const title = i[0].trim();
    const text = i[1].trim();
    return {
      slug: kebabCase(title),
      type: 'term',
      name: title,
      description: text,
      tags: [],
    } as Item;
  });
  items.sort((a, b) => a.slug.localeCompare(b.slug));
  return items;
}

async function fetchExicon(): Promise<Item[]> {
  const itemsRes = await fetch(EXICON_GOOGLE_SHEETS_JSON_URL_ITEMS);
  const itemsJson = (await itemsRes.json()) as ItemsResponse;
  const items = itemsJson.values.slice(1).map(i => {
    const title = i[0].trim();
    const tags = i[1]
      .trim()
      .split('|')
      .map(t => t.trim());
    const text = i[2].trim();
    return {
      slug: kebabCase(title),
      type: 'exercise',
      name: title,
      description: text,
      tags: tags,
    } as Item;
  });
  items.sort((a, b) => a.slug.localeCompare(b.slug));
  return items;
}

type Item = typeof itemsSchema.$inferInsert;

type ItemsResponse = {
  range: string;
  majorDimension: 'ROWS';
  values: string[][];
};
