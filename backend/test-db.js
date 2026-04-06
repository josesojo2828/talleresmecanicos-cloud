const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const workshops = await prisma.workshop.findMany({
    select: { id: true, name: true, slug: true, enabled: true }
  });
  console.log('--- TALLERES EN BASE DE DATOS ---');
  console.table(workshops);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
