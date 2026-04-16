import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole, WorkStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const PASSWORD = 'abc.12345';

interface CountryConfig {
    name: string;
    slug: string;
    cities: { name: string; slug: string }[];
    workshops: { name: string; address: string; lat: number; lng: number }[];
    clients: { firstName: string; lastName: string; email: string }[];
}

const COUNTRIES: CountryConfig[] = [
    {
        name: 'México',
        slug: 'mexico',
        cities: [
            { name: 'Ciudad de México', slug: 'cdmx' },
            { name: 'Guadalajara', slug: 'guadalajara' },
        ],
        workshops: [
            { name: 'AutoTech CDMX', address: 'Av. Reforma 500, CDMX', lat: 19.4326, lng: -99.1332 },
            { name: 'Mecánica Guadalajara Pro', address: 'Av. Vallarta 1200, GDL', lat: 20.6597, lng: -103.3496 },
        ],
        clients: [
            { firstName: 'Carlos', lastName: 'Hernández', email: 'carlos.mx@test.com' },
            { firstName: 'María', lastName: 'López', email: 'maria.mx@test.com' },
            { firstName: 'Pedro', lastName: 'Ramírez', email: 'pedro.mx@test.com' },
        ],
    },
    {
        name: 'Colombia',
        slug: 'colombia',
        cities: [
            { name: 'Bogotá', slug: 'bogota' },
            { name: 'Medellín', slug: 'medellin' },
        ],
        workshops: [
            { name: 'TallerPro Bogotá', address: 'Cra 7 #45-12, Bogotá', lat: 4.711, lng: -74.0721 },
        ],
        clients: [
            { firstName: 'Andrés', lastName: 'García', email: 'andres.co@test.com' },
            { firstName: 'Lucía', lastName: 'Martínez', email: 'lucia.co@test.com' },
            { firstName: 'Santiago', lastName: 'Ríos', email: 'santiago.co@test.com' },
        ],
    },
    {
        name: 'Venezuela',
        slug: 'venezuela',
        cities: [
            { name: 'Caracas', slug: 'caracas' },
            { name: 'Maracaibo', slug: 'maracaibo' },
        ],
        workshops: [
            { name: 'AutoServicios Caracas', address: 'Av. Libertador, Caracas', lat: 10.4806, lng: -66.9036 },
        ],
        clients: [
            { firstName: 'José', lastName: 'Rodríguez', email: 'jose.ve@test.com' },
            { firstName: 'Ana', lastName: 'Morales', email: 'ana.ve@test.com' },
            { firstName: 'Luis', lastName: 'Pérez', email: 'luis.ve@test.com' },
        ],
    },
    {
        name: 'Perú',
        slug: 'peru',
        cities: [
            { name: 'Lima', slug: 'lima' },
            { name: 'Arequipa', slug: 'arequipa' },
        ],
        workshops: [
            { name: 'MecánicaExpress Lima', address: 'Av. Javier Prado 800, Lima', lat: -12.0464, lng: -77.0428 },
        ],
        clients: [
            { firstName: 'Diego', lastName: 'Torres', email: 'diego.pe@test.com' },
            { firstName: 'Carmen', lastName: 'Flores', email: 'carmen.pe@test.com' },
            { firstName: 'Miguel', lastName: 'Castillo', email: 'miguel.pe@test.com' },
        ],
    },
];

const WORK_TITLES = [
    'Cambio de aceite y filtro',
    'Alineación y balanceo',
    'Reparación de frenos',
    'Diagnóstico electrónico',
    'Cambio de correa de distribución',
    'Service completo 50.000km',
    'Reparación de transmisión',
    'Cambio de amortiguadores',
];

const PUB_TITLES = [
    'Promoción de temporada',
    'Nuevo servicio de diagnóstico',
    'Oferta en cambio de aceite',
    'Descuento en alineación',
];

async function main() {
    console.log('🌱 Iniciando seed de prueba para SOPORTE REGIONAL...\n');

    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    // Cleanup: remove test data
    console.log('🧹 Limpiando datos anteriores de test...');
    await prisma.work.deleteMany({ where: { workshop: { country: { slug: { in: ['mexico', 'colombia', 'venezuela', 'peru'] } } } } });
    await prisma.forumPost.deleteMany({ where: { workshop: { country: { slug: { in: ['mexico', 'colombia', 'venezuela', 'peru'] } } } } });
    await prisma.publication.deleteMany({ where: { workshop: { country: { slug: { in: ['mexico', 'colombia', 'venezuela', 'peru'] } } } } });
    await prisma.workshop.deleteMany({ where: { country: { slug: { in: ['mexico', 'colombia', 'venezuela', 'peru'] } } } });
    await prisma.supportAssignment.deleteMany({ where: { user: { email: { contains: '@soporte-test.com' } } } });
    await prisma.user.deleteMany({ where: { email: { in: [
        ...COUNTRIES.flatMap(c => c.clients.map(cl => cl.email)),
        ...COUNTRIES.flatMap(c => c.workshops.map((_, i) => `taller.${c.slug}${i + 1}@test.com`)),
        'soporte.mexico@soporte-test.com',
        'soporte.global@soporte-test.com',
    ] } } });

    const countryMap: Record<string, string> = {};
    const cityMap: Record<string, string> = {};
    const workshopIds: Record<string, string[]> = {};

    for (const config of COUNTRIES) {
        // Find or create Country
        let country = await prisma.country.findFirst({ 
            where: { OR: [{ slug: config.slug }, { name: config.name }] } 
        });
        if (country) {
            await prisma.country.update({ where: { id: country.id }, data: { enabled: true, slug: config.slug } });
        } else {
            country = await prisma.country.create({
                data: { name: config.name, slug: config.slug, enabled: true },
            });
        }
        countryMap[config.slug] = country.id;
        console.log(`🌍 País: ${country.name} (${country.id})`);

        workshopIds[config.slug] = [];

        // Upsert Cities
        for (const cityConf of config.cities) {
            let city = await prisma.city.findFirst({
                where: { 
                    countryId: country.id,
                    OR: [{ slug: cityConf.slug }, { name: cityConf.name }]
                }
            });
            if (!city) {
                city = await prisma.city.create({
                    data: { name: cityConf.name, slug: cityConf.slug, countryId: country.id, enabled: true },
                });
            } else {
                await prisma.city.update({ where: { id: city.id }, data: { enabled: true, slug: cityConf.slug } });
            }
            cityMap[cityConf.slug] = city.id;
            console.log(`  🏙️ Ciudad: ${city.name}`);
        }

        // Create Clients
        for (const client of config.clients) {
            await prisma.user.create({
                data: {
                    firstName: client.firstName,
                    lastName: client.lastName,
                    email: client.email,
                    passwordHash: hashedPassword,
                    role: UserRole.CLIENT,
                    enabled: true,
                    countryId: country.id,
                },
            });
            console.log(`  👤 Cliente: ${client.firstName} ${client.lastName} (${client.email})`);
        }

        // Create Workshops (each needs a TALLER user)
        for (let i = 0; i < config.workshops.length; i++) {
            const ws = config.workshops[i];
            const citySlug = config.cities[i % config.cities.length].slug;
            const wsEmail = `taller.${config.slug}${i + 1}@test.com`;

            const tallerUser = await prisma.user.create({
                data: {
                    firstName: ws.name,
                    lastName: 'Admin',
                    email: wsEmail,
                    passwordHash: hashedPassword,
                    role: UserRole.TALLER,
                    enabled: true,
                    countryId: country.id,
                },
            });

            const workshop = await prisma.workshop.create({
                data: {
                    name: ws.name,
                    address: ws.address,
                    latitude: ws.lat,
                    longitude: ws.lng,
                    enabled: true,
                    userId: tallerUser.id,
                    countryId: country.id,
                    cityId: cityMap[citySlug],
                    logoUrl: `https://api.dicebear.com/7.x/initials/png?seed=${ws.name}&backgroundColor=10b981`,
                    images: [
                        `https://picsum.photos/seed/${ws.name}1/800/600`,
                        `https://picsum.photos/seed/${ws.name}2/800/600`
                    ],
                    slug: ws.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                },
            });

            workshopIds[config.slug].push(workshop.id);
            console.log(`  🔧 Taller: ${workshop.name} en ${citySlug}`);

            // Create Work Orders (vary by country)
            const workCount = config.slug === 'mexico' ? 6 : config.slug === 'colombia' ? 4 : config.slug === 'venezuela' ? 3 : 2;
            const statuses = [WorkStatus.OPEN, WorkStatus.IN_PROGRESS, WorkStatus.COMPLETED, WorkStatus.DELIVERED];

            for (let j = 0; j < workCount; j++) {
                const daysAgo = Math.floor(Math.random() * 28) + 1;
                await prisma.work.create({
                    data: {
                        workshopId: workshop.id,
                        title: WORK_TITLES[j % WORK_TITLES.length],
                        description: `Orden de trabajo #${j + 1} para ${ws.name}`,
                        status: statuses[j % statuses.length],
                        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
                        clientName: config.clients[j % config.clients.length].firstName,
                        vehicleLicensePlate: `${config.slug.toUpperCase().slice(0, 2)}-${1000 + j}`,
                        laborPrice: 50 + (j * 25),
                        currency: 'USD',
                    },
                });
            }
            console.log(`    📋 ${workCount} órdenes de trabajo creadas`);

            // Create Publications (1 or 2 per workshop - NEWS/PROMOS)
            const pubCount = Math.floor(Math.random() * 2) + 1;
            for (let p = 0; p < pubCount; p++) {
                await prisma.publication.create({
                    data: {
                        workshopId: workshop.id,
                        userId: tallerUser.id,
                        title: `${PUB_TITLES[p % PUB_TITLES.length]} - ${ws.name}`,
                        content: `Esta es una promoción/noticia del taller ${ws.name}.`,
                        enabled: true,
                    },
                });
            }
            console.log(`    📰 ${pubCount} publicaciones creadas (Promos)`);

            // Create ForumPosts (1 or 2 per workshop - FORUM)
            for (let f = 0; f < pubCount; f++) {
                await prisma.forumPost.create({
                    data: {
                        workshopId: workshop.id,
                        userId: tallerUser.id,
                        title: `Consulta técnica: ${WORK_TITLES[f % WORK_TITLES.length]} - ${ws.name}`,
                        content: `Alguien me puede ayudar con este problema en un taller de ${config.name}?`,
                        enabled: true,
                    },
                });
            }
            console.log(`    💬 ${pubCount} posts creados en el foro`);
        }
    }

    // Create Support users
    console.log('\n👮 Creando usuarios de SOPORTE...');

    // SOPORTE MÉXICO (should only see Mexico data)
    const soporteMexico = await prisma.user.create({
        data: {
            firstName: 'Soporte',
            lastName: 'México',
            email: 'soporte.mexico@soporte-test.com',
            passwordHash: hashedPassword,
            role: UserRole.SUPPORT,
            enabled: true,
        },
    });
    await prisma.supportAssignment.create({
        data: {
            userId: soporteMexico.id,
            countryId: countryMap['mexico'],
        },
    });
    console.log(`  🇲🇽 soporte.mexico@soporte-test.com -> Asignado a México`);

    // SOPORTE GLOBAL (all 4 countries)
    const soporteGlobal = await prisma.user.create({
        data: {
            firstName: 'Soporte',
            lastName: 'Global',
            email: 'soporte.global@soporte-test.com',
            passwordHash: hashedPassword,
            role: UserRole.SUPPORT,
            enabled: true,
        },
    });
    for (const slug of ['mexico', 'colombia', 'venezuela', 'peru']) {
        await prisma.supportAssignment.create({
            data: {
                userId: soporteGlobal.id,
                countryId: countryMap[slug],
            },
        });
    }
    console.log(`  🌎 soporte.global@soporte-test.com -> Asignado a 4 países`);

    // Summary
    console.log('\n📊 RESUMEN DE DATOS CREADOS:');
    console.log('═══════════════════════════════════════');
    for (const config of COUNTRIES) {
        const wsCount = await prisma.workshop.count({ where: { countryId: countryMap[config.slug] } });
        const workCount = await prisma.work.count({ where: { workshop: { countryId: countryMap[config.slug] } } });
        const pubCount = await prisma.publication.count({ where: { workshop: { countryId: countryMap[config.slug] } } });
        const clientCount = await prisma.user.count({ where: { countryId: countryMap[config.slug], role: UserRole.CLIENT } });
        console.log(`  ${config.name}: ${wsCount} talleres, ${clientCount} clientes, ${workCount} órdenes, ${pubCount} publicaciones`);
    }
    console.log('═══════════════════════════════════════');
    console.log('\n🔑 CREDENCIALES DE PRUEBA:');
    console.log('  Contraseña para TODOS: abc.12345');
    console.log('  soporte.mexico@soporte-test.com  -> Solo México');
    console.log('  soporte.global@soporte-test.com  -> Todos los países');
    console.log('\n✅ Seed completado!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
