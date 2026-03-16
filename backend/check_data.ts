import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({} as any);
async function main() {
    const ws = await prisma.workshop.findMany({ select: { name: true, latitude: true, longitude: true } });
    console.log(JSON.stringify(ws, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
