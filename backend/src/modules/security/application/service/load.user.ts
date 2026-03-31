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

        const users = [superadmin, admin, clientUser];

        console.log('\n' + '='.repeat(60));
        this.logger.log('CREDENCIALES DE ACCESO (SEED)');
        users.forEach(u => {
            this.logger.log(`[${u.role.padEnd(8)}] Email: ${u.email.padEnd(25)} | Pass: ${passwordPlain}`);
        });
        console.log('='.repeat(60) + '\n');

        return;
    }
}
