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
        
        // Resolve Support assignments
        const countryIds = user && user.role === UserRole.SUPPORT 
            ? user.assignments?.map((a: any) => a.countryId).filter(Boolean) || []
            : [];
        const cityIds = user && user.role === UserRole.SUPPORT 
            ? user.assignments?.map((a: any) => a.cityId).filter(Boolean) || []
            : [];

        // Scope for users (by country if available)
        const userScope: any = {};
        if (user && user.role === UserRole.SUPPORT) {
            if (countryIds.length > 0) {
                userScope.countryId = { in: countryIds };
            } else if (cityIds.length > 0) {
                userScope.country = { cities: { some: { id: { in: cityIds } } } };
            }
        }

        // Scope for countries and cities stats
        const countryFilters: any = { enabled: true };
        const cityFilters: any = { enabled: true };

        if (user && user.role === UserRole.SUPPORT) {
            const cityOrFilters: any[] = [];
            if (countryIds.length > 0) cityOrFilters.push({ countryId: { in: countryIds } });
            if (cityIds.length > 0) cityOrFilters.push({ id: { in: cityIds } });

            if (cityOrFilters.length > 0) {
                cityFilters.OR = cityOrFilters;
                countryFilters.OR = [
                    { id: { in: countryIds } },
                    { cities: { some: { id: { in: cityIds } } } }
                ];
            } else {
                countryFilters.id = 'none';
                cityFilters.id = 'none';
            }
        }

        const [
            totalWorkshops,
            totalUsers,
            totalWorks,
            totalAppointments,
            totalCountries,
            totalCities,
            totalPublications,
            recentWorkshops,
            recentWorks,
            recentCities,
            workshopLocations,
            productionRaw
        ] = await Promise.all([
            this.prisma.workshop.count({ where: { ...scope, deletedAt: null } }),
            this.prisma.user.count({ where: { ...userScope, deletedAt: null } }),
            this.prisma.work.count({ where: { ...workScope, deletedAt: null } }),
            this.prisma.appointment.count({ where: { ...workScope, deletedAt: null } }),
            this.prisma.country.count({ where: countryFilters }),
            this.prisma.city.count({ where: cityFilters }),
            this.prisma.publication.count({ where: { ...workScope, deletedAt: null } }),
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
            this.prisma.city.findMany({
                where: { ...cityFilters, deletedAt: null },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { country: { select: { name: true } } }
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
            }),
            this.prisma.work.findMany({
                where: { 
                    ...workScope, 
                    createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
                    deletedAt: null 
                },
                select: { createdAt: true }
            })
        ]);

        // Process production data by day
        const production = productionRaw.reduce((acc: any, work: any) => {
            const date = work.createdAt.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const productionStats = Object.keys(production)
            .sort()
            .map(date => ({ date, count: production[date] }));

        return {
            stats: {
                totalWorkshops,
                totalUsers,
                totalWorks,
                totalAppointments,
                totalCountries,
                totalCities,
                totalPublications,
            },
            recentWorkshops,
            recentWorks,
            recentCities,
            workshopLocations,
            productionStats
        };
    }
}
