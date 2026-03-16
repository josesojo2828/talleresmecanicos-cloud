import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({} as any);
async function main() {
    const list = await prisma.workshop.findMany({ select: { name: true, latitude: true, longitude: true, enabled: true } });
    console.log(JSON.stringify(list, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
