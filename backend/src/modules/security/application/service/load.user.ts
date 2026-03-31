import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoadUserService {
    private readonly logger = new Logger(LoadUserService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        const passwordPlain = 'abc.12345';
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(passwordPlain, salt);

        const superadmin = await this.prisma.user.upsert({
            where: { email: 'superadmin@example.com' },
            update: {
                passwordHash,
                role: 'ADMIN',
            },
            create: {
                email: 'superadmin@example.com',
                passwordHash,
                firstName: 'Super',
                lastName: 'Admin',
                role: 'ADMIN',
                profile: {
                    create: {}
                }
            }
        })

        const admin = await this.prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {
                passwordHash,
                role: 'ADMIN',
            },
            create: {
                email: 'admin@example.com',
                passwordHash,
                firstName: 'Admin',
                lastName: 'App',
                role: 'ADMIN',
                profile: {
                    create: {}
                }
            }
        })

        const demoUser = await this.prisma.user.upsert({
            where: { email: 'demo@example.com' },
            update: {
                passwordHash,
                role: 'TALLER',
            },
            create: {
                email: 'demo@example.com',
                passwordHash,
                firstName: 'Demo',
                lastName: 'User',
                role: 'TALLER',
                profile: {
                    create: {}
                }
            }
        })

        const tallerUser = await this.prisma.user.upsert({
            where: { email: 'taller@example.com' },
            update: {
                passwordHash,
                role: 'TALLER',
            },
            create: {
                email: 'taller@example.com',
                passwordHash,
                firstName: 'Taller',
                lastName: 'Demo',
                role: 'TALLER',
                profile: {
                    create: {}
                }
            }
        });

        const clientUser = await this.prisma.user.upsert({
            where: { email: 'cliente@example.com' },
            update: {
                passwordHash,
                role: 'CLIENT',
            },
            create: {
                email: 'cliente@example.com',
                passwordHash,
                firstName: 'Cliente',
                lastName: 'Demo',
                role: 'CLIENT',
                profile: {
                    create: {}
                }
            }
        })

        // Create Workshop for the Taller user IF it doesn't exist
        const defaultCountry = await this.prisma.country.findFirst({ where: { name: "Venezuela" } });
        const defaultCity = await this.prisma.city.findFirst({ where: { countryId: defaultCountry.id } });

        if (defaultCountry && defaultCity) {
            const workshop = await this.prisma.workshop.upsert({
                where: { userId: tallerUser.id },
                update: {
                    latitude: 19.3582,
                    longitude: -99.1764,
                    socialMedia: {
                        facebook: 'https://facebook.com/tallerdemo',
                        instagram: 'https://instagram.com/tallerdemo',
                        twitter: 'https://twitter.com/tallerdemo'
                    },
                    enabled: true,
                    openingHours: 'Lun-Vie 9:00 - 18:00\nSáb 9:00 - 13:00',
                    slug: 'taller-demo'
                },
                create: {
                    name: 'Taller Mecánico Demo',
                    address: 'Av. Insurgentes Sur 123, Ciudad de México',
                    phone: '+52 55 1234 5678',
                    whatsapp: '+52 55 1234 5678',
                    latitude: 19.3582,
                    longitude: -99.1764,
                    logoUrl: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=200',
                    images: [
                        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200',
                        'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=1200'
                    ],
                    socialMedia: {
                        facebook: 'https://facebook.com/tallerdemo',
                        instagram: 'https://instagram.com/tallerdemo',
                        twitter: 'https://twitter.com/tallerdemo'
                    },
                    userId: tallerUser.id,
                    countryId: defaultCountry.id,
                    cityId: defaultCity.id,
                    openingHours: 'Lun-Vie 9:00 - 18:00\nSáb 9:00 - 13:00',
                    enabled: true,
                    slug: 'taller-demo'
                }
            });

            // Associate workshop also to demoUser if desired, or just create another one
            await this.prisma.workshop.upsert({
                where: { userId: demoUser.id },
                update: { enabled: true },
                create: {
                    name: 'Demo Workshop',
                    address: 'Calle Falsa 123',
                    phone: '123456789',
                    userId: demoUser.id,
                    countryId: defaultCountry.id,
                    cityId: defaultCity.id,
                    enabled: true,
                    slug: 'demo-workshop'
                }
            });

            // Create some Works
            const workCount = await this.prisma.work.count({ where: { workshopId: workshop.id } });
            if (workCount === 0) {
                await this.prisma.work.createMany({
                    data: [
                        {
                            publicId: 'WORK-101',
                            title: 'Cambio de Aceite y Filtros',
                            description: 'Mantenimiento preventivo completo.',
                            status: 'COMPLETED',
                            workshopId: workshop.id,
                            clientId: clientUser.id
                        },
                        {
                            publicId: 'WORK-102',
                            title: 'Revisión de Frenos',
                            description: 'Cambio de pastillas delanteras.',
                            status: 'DELIVERED',
                            workshopId: workshop.id,
                            clientId: clientUser.id
                        },
                        {
                            publicId: 'WORK-103',
                            title: 'Reparación de Suspensión',
                            description: 'Cambio de amortiguadores traseros.',
                            status: 'IN_PROGRESS',
                            workshopId: workshop.id,
                        }
                    ]
                });
            }
        }

        const users = [superadmin, admin, demoUser, tallerUser, clientUser];

        console.log('\n' + '='.repeat(60));
        this.logger.log('CREDENCIALES DE ACCESO (SEED)');
        users.forEach(u => {
            this.logger.log(`[${u.role.padEnd(8)}] Email: ${u.email.padEnd(25)} | Pass: ${passwordPlain}`);
        });
        console.log('='.repeat(60) + '\n');

        return;
    }
}
