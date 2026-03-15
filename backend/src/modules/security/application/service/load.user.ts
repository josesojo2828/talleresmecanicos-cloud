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
                role: 'SUPPORT',
            },
            create: {
                email: 'demo@example.com',
                passwordHash,
                firstName: 'Demo',
                lastName: 'User',
                role: 'SUPPORT',
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

        // Create Workshop for the Taller user IF it doesn't exist
        const defaultCountry = await this.prisma.country.findFirst();
        const defaultCity = await this.prisma.city.findFirst();

        if (defaultCountry && defaultCity) {
            await this.prisma.workshop.upsert({
                where: { userId: tallerUser.id },
                update: {},
                create: {
                    name: 'Taller Mecánico Demo',
                    address: 'Av. Insurgentes Sur 123, CDMX',
                    phone: '+52 55 1234 5678',
                    whatsapp: '+52 55 1234 5678',
                    userId: tallerUser.id,
                    countryId: defaultCountry.id,
                    cityId: defaultCity.id,
                    openingHours: 'Lun-Vie 9:00 - 18:00',
                    enabled: true
                }
            });
        }

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
