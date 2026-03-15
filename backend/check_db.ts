
import { PrismaClient } from './prisma/generated/client';

const prisma = new PrismaClient({} as any);

async function main() {
  const count = await prisma.country.count();
  const all = await prisma.country.findMany();
  console.log('Total countries:', count);
  console.log('Countries:', JSON.stringify(all, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
