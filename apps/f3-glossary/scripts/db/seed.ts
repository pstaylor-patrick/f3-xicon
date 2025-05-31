import { seedArticles } from './articles/seed';
import { seedItems } from './items/seed';
import { seedRegions } from './regions/seed';

export async function seed() {
  await seedArticles();
  await seedItems();
  await seedRegions();
}

seed();
