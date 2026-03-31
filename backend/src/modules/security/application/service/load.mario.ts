import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import * as bcrypt from 'bcrypt';
import { AppointmentStatus, UserRole, WorkStatus } from "@prisma/client";

@Injectable()
export class LoadMarioService {
    private readonly logger = new Logger(LoadMarioService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        this.logger.log('MARIO SEED: Iniciando creación de cuenta demo para Mario.');

        const passwordPlain = 'abc.12345';
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(passwordPlain, salt);

        // 1. Crear Usuario Mario (TALLER)
        const mario = await this.prisma.user.upsert({
            where: { email: 'mario@example.com' },
            update: {
                passwordHash,
                role: UserRole.TALLER,
                firstName: 'Mario',
                lastName: 'Mecánico',
            },
            create: {
                email: 'mario@example.com',
                passwordHash,
                firstName: 'Mario',
                lastName: 'Mecánico',
                role: UserRole.TALLER,
                profile: {
                    create: {
                        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200'
                    }
                }
            }
        });

        // 2. Buscar Regiones para CDMX
        const mexico = await this.prisma.country.findUnique({ where: { name: 'México' } });
        const cdmx = await this.prisma.city.findFirst({ 
            where: { 
                name: 'Ciudad de México',
                countryId: mexico?.id 
            } 
        });

        if (!mexico || !cdmx) {
            this.logger.error('MARIO SEED: No se encontró México o CDMX en las regiones. Abortando.');
            return;
        }

        // 3. Crear Taller "Mario Motors"
        const workshop = await this.prisma.workshop.upsert({
            where: { userId: mario.id },
            update: {
                name: 'Mario Motors CDMX',
                address: 'Av. Paseo de la Reforma 250, Juárez, CDMX',
                phone: '+52 55 9876 5432',
                whatsapp: '+52 55 9876 5432',
                latitude: 19.4270,
                longitude: -99.1676,
                enabled: true,
                slug: 'mario-motors-cdmx'
            },
            create: {
                name: 'Mario Motors CDMX',
                address: 'Av. Paseo de la Reforma 250, Juárez, CDMX',
                phone: '+52 55 9876 5432',
                whatsapp: '+52 55 9876 5432',
                latitude: 19.4270,
                longitude: -99.1676,
                logoUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36aeaf?q=80&w=200',
                images: [
                    'https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=1200',
                    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200'
                ],
                userId: mario.id,
                countryId: mexico.id,
                cityId: cdmx.id,
                enabled: true,
                slug: 'mario-motors-cdmx',
                openingHours: 'Lun-Sáb 8:00 - 19:00'
            }
        });

        // 4. Crear Categorías de Repuestos y Piezas
        const catMotor = await this.prisma.partCategory.upsert({
            where: { name_workshopId: { name: 'Motor', workshopId: workshop.id } },
            update: {},
            create: { name: 'Motor', workshopId: workshop.id }
        });

        const partsData = [
            { name: 'Filtro de Aceite Sintético', sku: 'MOT-001', price: 15.50, quantity: 50, categoryId: catMotor.id },
            { name: 'Bujías de Iridio (Set 4)', sku: 'MOT-002', price: 45.00, quantity: 20, categoryId: catMotor.id },
            { name: 'Kit de Distribución', sku: 'MOT-003', price: 120.00, quantity: 5, categoryId: catMotor.id },
            { name: 'Bomba de Agua', sku: 'MOT-004', price: 85.00, quantity: 8, categoryId: catMotor.id }
        ];

        for (const p of partsData) {
            await this.prisma.part.upsert({
                where: { id: `mario-part-${p.sku}` }, // Un hack para upsert si no tengo ID real, pero mejor uso findFirst
                update: { quantity: p.quantity, price: p.price },
                create: { 
                    ...p, 
                    workshopId: workshop.id 
                }
            }).catch(async () => {
                // Si falla el upsert por el ID manual, intentamos buscar por SKU
                const existing = await this.prisma.part.findFirst({ where: { sku: p.sku, workshopId: workshop.id } });
                if (!existing) {
                    await this.prisma.part.create({ data: { ...p, workshopId: workshop.id } });
                } else {
                    await this.prisma.part.update({ where: { id: existing.id }, data: { ...p } });
                }
            });
        }

        // 5. Crear Citas (15/25 desde hoy 31 de marzo)
        const today = new Date('2026-03-31T10:00:00');
        const appointmentsCount = await this.prisma.appointment.count({ where: { workshopId: workshop.id } });
        
        if (appointmentsCount < 15) {
            const client = await this.prisma.user.findFirst({ where: { role: UserRole.CLIENT } });
            if (client) {
                for (let i = 0; i < 20; i++) {
                    const appointmentDate = new Date(today);
                    appointmentDate.setDate(today.getDate() + i);
                    appointmentDate.setHours(9 + (i % 8), 0, 0, 0);

                    await this.prisma.appointment.create({
                        data: {
                            workshopId: workshop.id,
                            clientId: client.id,
                            dateTime: appointmentDate,
                            description: `Cita de mantenimiento preventivo #${i + 1}`,
                            status: i < 5 ? AppointmentStatus.COMPLETED : (i < 12 ? AppointmentStatus.ACCEPTED : AppointmentStatus.PENDING)
                        }
                    });
                }
            }
        }

        // 6. Crear 3 Publicaciones de alto valor
        const pubCount = await this.prisma.publication.count({ where: { workshopId: workshop.id } });
        if (pubCount < 3) {
            await this.prisma.publication.createMany({
                data: [
                    {
                        title: 'Afinación Mayor con Escaneo Computarizado',
                        content: 'Incluye limpieza de inyectores, cambio de bujías, filtros y aceite. Garantía de 6 meses.',
                        images: ['https://images.unsplash.com/photo-1487754156051-c358a3e00b1a?q=80&w=800'],
                        userId: mario.id,
                        workshopId: workshop.id
                    },
                    {
                        title: 'Especialista en Transmisiones Automáticas',
                        content: 'Reparación y mantenimiento de cajas DSG, CVT y convencionales. Contamos con equipo de diagnóstico original.',
                        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800'],
                        userId: mario.id,
                        workshopId: workshop.id
                    },
                    {
                        title: 'Servicio de Frenos Cerámicos',
                        content: 'Instalación de pastillas de alta eficiencia para un frenado superior y silencioso.',
                        images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800'],
                        userId: mario.id,
                        workshopId: workshop.id
                    }
                ]
            });
        }

        // 7. Crear Órdenes de Trabajo (Culminadas e integradas)
        const workData = [
            {
                publicId: 'MARIO-W-001',
                title: 'Reparación de Transmisión Jetta A6',
                description: 'Cambio de cuerpo de válvulas y solenoide de 3ra.',
                status: WorkStatus.DELIVERED,
                workshopId: workshop.id,
                clientName: 'Juan Pérez',
                clientPhone: '5511223344',
                vehicleLicensePlate: 'MEX-123-A'
            },
            {
                publicId: 'MARIO-W-002',
                title: 'Afinación de Honda CR-V',
                description: 'Afinación mayor completa realizada con éxito.',
                status: WorkStatus.COMPLETED,
                workshopId: workshop.id,
                clientName: 'María García',
                clientPhone: '5599887766',
                vehicleLicensePlate: 'CDMX-998-Z'
            },
            {
                publicId: 'MARIO-W-003',
                title: 'Cambio de Suspensión Delantera',
                description: 'En proceso: Cambiando amortiguadores y terminales.',
                status: WorkStatus.IN_PROGRESS,
                workshopId: workshop.id,
                clientName: 'Carlos Tapia',
                vehicleLicensePlate: 'MEX-000-B'
            }
        ];

        for (const w of workData) {
            await this.prisma.work.upsert({
                where: { publicId: w.publicId },
                update: { ...w },
                create: { ...w }
            });
        }

        this.logger.log('MARIO SEED: Seeding de Mario completado con éxito.');
    }
}
