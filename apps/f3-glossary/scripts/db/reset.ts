import { resetArticles } from './articles/reset';
import { resetItems } from './items/reset';
import { resetRegions } from './regions/reset';

export async function reset() {
  await resetArticles();
  await resetItems();
  await resetRegions();
}

reset();
