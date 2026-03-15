import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadPublicationsService {
    private readonly logger = new Logger(LoadPublicationsService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        this.logger.log(`PUBLICACIONES SEED: Comenzando seeding de publicaciones.`);

        const workshops = await this.prisma.workshop.findMany({
            include: { user: true },
            take: 5
        });

        const users = await this.prisma.user.findMany({ take: 5 });
        this.logger.log(`PUBLICACIONES SEED: Se encontraron ${users.length} usuarios y ${workshops.length} talleres.`);

        if (users.length === 0) {
            this.logger.warn('PUBLICACIONES SEED: No hay usuarios registrados para crear publicaciones.');
            return;
        }

        const publicationsData = [
            {
                title: '¡Oferta! Cambio de aceite y filtro con 20% de descuento',
                content: 'Durante todo este mes, aprovecha nuestro combo de mantenimiento preventivo para mantener tu motor como nuevo. Incluye revisión de 21 puntos gratis.',
                images: ['https://images.unsplash.com/photo-1486006396113-ad7b32b7e2d1?q=80&w=800&auto=format&fit=crop'],
                enabled: true,
            },
            {
                title: 'Limpieza de Inyectores por Ultrasonido',
                content: 'Mejora el rendimiento de tu combustible y la potencia de tu motor con nuestro servicio especializado de limpieza de inyectores.',
                images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9c7?q=80&w=800&auto=format&fit=crop'],
                enabled: true,
            },
            {
                title: 'Diagnóstico Computarizado Gratis',
                content: '¿Se encendió la luz de Check Engine? Ven con nosotros y te escaneamos el vehículo sin costo al realizar cualquier reparación.',
                images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'],
                enabled: true,
            },
            {
                title: 'Vendo Escáner Automotriz OBD2',
                content: 'Excelente estado, casi nuevo. Compatible con la mayoría de los vehículos modernos. Entrega personal.',
                images: ['https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=800&auto=format&fit=crop'],
                enabled: true,
            }
        ];

        let createdCount = 0;
        for (let i = 0; i < publicationsData.length; i++) {
            const pub = publicationsData[i];

            // Link to a workshop if available, otherwise just to a user
            const workshop = workshops[i % workshops.length];
            const user = workshop?.user || users[i % users.length];

            const existing = await this.prisma.publication.findFirst({
                where: { title: pub.title, userId: user.id }
            });

            if (!existing) {
                await this.prisma.publication.create({
                    data: {
                        ...pub,
                        userId: user.id,
                        workshopId: workshop?.id || null
                    }
                });
                createdCount++;
            }
        }

        if (createdCount > 0) {
            this.logger.log(`PUBLICACIONES SEED: ${createdCount} ofertas y anuncios creados.`);
        } else {
            this.logger.log(`PUBLICACIONES SEED: No se crearon nuevas publicaciones (ya existen o error).`);
        }
    }
}
