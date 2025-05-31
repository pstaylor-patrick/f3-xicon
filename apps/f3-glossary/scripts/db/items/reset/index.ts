import { db } from '@/drizzle/db';
import { itemsSchema } from '@/drizzle/schemas';

export async function resetItems() {
  await db.delete(itemsSchema);
}
