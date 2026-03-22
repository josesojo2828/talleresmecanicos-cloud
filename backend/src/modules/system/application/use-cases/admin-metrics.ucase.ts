import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class AdminMetricsUCase {
    constructor(private readonly prisma: PrismaService) {}

    async getDashboardSummary() {
        const [
            totalWorkshops,
            totalUsers,
            totalWorks,
            totalAppointments,
            totalCountries,
            totalCities,
            recentWorkshops,
            recentWorks,
            workshopLocations
        ] = await Promise.all([
            this.prisma.workshop.count(),
            this.prisma.user.count(),
            this.prisma.work.count(),
            this.prisma.appointment.count(),
            this.prisma.country.count({ where: { enabled: true } }),
            this.prisma.city.count({ where: { enabled: true } }),
            this.prisma.workshop.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, email: true } } }
            }),
            this.prisma.work.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { workshop: { select: { name: true } } }
            }),
            this.prisma.workshop.findMany({
                select: {
                    id: true,
                    name: true,
                    latitude: true,
                    longitude: true,
                    address: true,
                    phone: true,
                    logoUrl: true
                }
            })
        ]);

        return {
            stats: {
                totalWorkshops,
                totalUsers,
                totalWorks,
                totalAppointments,
                totalCountries,
                totalCities,
            },
            recentWorkshops,
            recentWorks,
            workshopLocations
        };
    }
}
