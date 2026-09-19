'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getRouteByZip(zipCode: string) {
  const cleanZip = zipCode.trim().substring(0, 5);
  const loc = await prisma.location.findUnique({ where: { zip: cleanZip } });
  
  if (!loc) {
    return { error: 'Zip code not found in our coverage area.' };
  }

  const state = loc.state.toLowerCase();
  const city = loc.city.toLowerCase().replace(/\s+/g, '-');
  
  return { url: `/internet/${state}/${city}/${loc.zip}` };
}