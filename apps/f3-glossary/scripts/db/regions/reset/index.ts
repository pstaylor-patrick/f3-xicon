import { db } from '@/drizzle/db';
import { regionsSchema } from '@/drizzle/schemas';

export async function resetRegions() {
  await db.delete(regionsSchema);
}
