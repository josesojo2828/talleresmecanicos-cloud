import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { PrismaService } from "src/config/prisma.service";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export class AdminMetricsUCase {
    constructor(private readonly prisma: PrismaService) {}

    async getPublicStats() {
        const [workshops, publications, countries] = await Promise.all([
            this.prisma.workshop.count({ where: { enabled: true, deletedAt: null } }),
            this.prisma.forumPost.count({ where: { enabled: true, deletedAt: null } }),
            this.prisma.country.count({ where: { enabled: true, deletedAt: null } })
        ]);

        return {
            workshops: workshops || 0,
            publications: publications || 0,
            countries: countries || 0
        };
    }

    async getDashboardSummary(user?: any) {
        const scope = getScopeFilter(user);
        
        // Specific scope for entities related to workshops
        const workScope = getScopeFilter(user, 'workshop');
        
        // Scope for users (by country if available)
        const userScope: any = {};
        if (user && user.role === UserRole.SUPPORT) {
            const countryIds = user.assignments?.map(a => a.countryId).filter(Boolean) || [];
            if (countryIds.length > 0) userScope.countryId = { in: countryIds };
        }

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
            this.prisma.workshop.count({ where: { ...scope, deletedAt: null } }),
            this.prisma.user.count({ where: { ...userScope, deletedAt: null } }),
            this.prisma.work.count({ where: { ...workScope, deletedAt: null } }),
            this.prisma.appointment.count({ where: { ...workScope, deletedAt: null } }),
            this.prisma.country.count({ where: { enabled: true } }),
            this.prisma.city.count({ where: { enabled: true } }),
            this.prisma.workshop.findMany({
                where: { ...scope, deletedAt: null },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { firstName: true, email: true } } }
            }),
            this.prisma.work.findMany({
                where: { ...workScope, deletedAt: null },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { workshop: { select: { name: true } } }
            }),
            this.prisma.workshop.findMany({
                where: { ...scope, deletedAt: null },
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
