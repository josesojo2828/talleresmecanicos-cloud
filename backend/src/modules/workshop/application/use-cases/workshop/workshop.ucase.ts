import { BadRequestException, Injectable, ForbiddenException } from "@nestjs/common";
import WorkshopModel from "../../../domain/models/workshop.model";
import WorkshopPersistence from "../../../infrastructure/persistence/workshop/persistence";
import { ICreateWorkshopDto, IUpdateWorkshopDto } from "../../dtos/workshop.dto";
import { QueryOptions } from "src/shared/query/input";
import { Workshop, UserRole } from "@prisma/client";
import { IWorkshopQueryFilter } from "../../dtos/workshop.schema";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export class WorkshopUCase extends WorkshopModel {
    constructor(private readonly persistence: WorkshopPersistence) {
        super();
    }

    async create(data: ICreateWorkshopDto, user?: any) {
        const { countryId, cityId, categoryIds, userId, ...rest } = data;

        if (user?.role === UserRole.SUPPORT) {
            const assignedCountryIds = user.regions?.map((r: any) => r.countryId) || [];
            const assignedCityIds = user.regions?.map((r: any) => r.cityId) || [];
            
            const isCountryAllowed = assignedCountryIds.includes(countryId);
            const isCityAllowed = cityId && assignedCityIds.includes(cityId);

            if (!isCountryAllowed && !isCityAllowed) {
                throw new ForbiddenException("No tienes permiso para crear talleres fuera de tu región asignada");
            }
        }

        console.log(data);

        const body: any = {
            ...rest,
            enabled: false, // Default to false as per requirement
            user: { connect: { id: userId } },
            country: { connect: { id: countryId } },
            city: { connect: { id: cityId } },
        };

        if (categoryIds && categoryIds.length > 0) {
            body.WorkshopToCategory = {
                create: categoryIds.map(id => ({ B: id }))
            };
        }

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async update(id: string, data: IUpdateWorkshopDto, user: any) {
        console.log(`[WorkshopUCase] Updating workshop ${id} with data:`, JSON.stringify(data, null, 2));
        await this.findOne(id, user); 
        
        const { 
            name, description, address, phone, whatsapp, website, 
            latitude, longitude, logoUrl, images, openingHours, 
            socialMedia, enabled, countryId, cityId, categoryIds 
        } = data;

        const body: any = {};
        if (name !== undefined) body.name = name;
        if (description !== undefined) body.description = description;
        if (address !== undefined) body.address = address;
        if (phone !== undefined) body.phone = phone;
        if (whatsapp !== undefined) body.whatsapp = whatsapp;
        if (website !== undefined) body.website = website;
        if (latitude !== undefined) body.latitude = latitude;
        if (longitude !== undefined) body.longitude = longitude;
        if (logoUrl !== undefined) {
            if (typeof logoUrl === 'string') body.logoUrl = logoUrl;
            else body.logoUrl = null; 
        }
        if (images !== undefined) {
            if (Array.isArray(images)) {
                body.images = images.filter(img => typeof img === 'string');
            } else {
                body.images = [];
            }
        }
        if (openingHours !== undefined) body.openingHours = openingHours;
        if (socialMedia !== undefined) body.socialMedia = socialMedia;
        if (enabled !== undefined) body.enabled = enabled;

        if (countryId) body.country = { connect: { id: countryId } };
        if (cityId) body.city = { connect: { id: cityId } };
        
        if (categoryIds !== undefined) {
            body.WorkshopToCategory = {
                deleteMany: {},
                create: (categoryIds || []).map(id => ({ B: id }))
            };
        }


        return {
            message: 'success.update',
            data: await this.persistence.update(id, body)
        };
    }

    async delete(id: string, user: any) {
        await this.findOne(id, user); // Verification
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any) {
        if (!user) {
            const entity = await this.persistence.find({ id, enabled: true });
            if (!entity) throw new ForbiddenException("No se encontró el taller");
            return entity;
        }

        const scope = getScopeFilter(user);
        const where = { id, ...scope };
        const entity = await this.persistence.find(where);
        
        if (!entity) {
            throw new ForbiddenException("No tienes permiso para acceder a este taller o no existe");
        }
        
        return entity;
    }

    async pagination(q: QueryOptions<Workshop, IWorkshopQueryFilter>, user: any) {
        console.log('📬 RECIBIDO EN USECASE (RAW q):', JSON.stringify(q, null, 2));
        const { search, filters, skip, take, orderBy, ...others } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        // Mezclamos los filtros explícitos con los parámetros que vengan en el root (como el slug)
        const combinedFilters = { ...(parsedFilters || {}), ...others };
        const scope = getScopeFilter(user);
        
        const where = {
            AND: [
                this.getWhere(combinedFilters, search),
                user ? scope : { enabled: true }
            ]
        };
        console.log('🏗️ CLAUSULA WHERE (PRISMA):', JSON.stringify(where, null, 2));

        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }

    async getMyProfile(user: any) {
        const workshop = await this.persistence.find({ userId: user.id });
        return {
            data: workshop ? [workshop] : [],
            meta: { totalItems: workshop ? 1 : 0 }
        };
    }

    async getDashboardStats(user: any) {
        const workshop = await this.persistence.find({ userId: user.id });
        if (!workshop) {
            return {
                workshop: null,
                stats: {
                    works: { total: 0, breakdown: {} },
                    appointments: { total: 0, last: null },
                    inventory: { total: 0 }
                },
                timeline: [],
                recent: {
                    appointments: [],
                    works: [],
                    publications: []
                }
            };
        }

        const workshopId = workshop.id;

        // 1. Stats and Lists
        const [
            statusCounts,
            lastAppointment,
            inventoryCount,
            recentAppointments,
            recentWorks,
            recentPublications,
            worksTimeline
        ] = await Promise.all([
            // Status breakdown
            (this.persistence as any).prisma.work.groupBy({
                by: ['status'],
                where: { workshopId, deletedAt: null },
                _count: true
            }),
            // Last appointment
            (this.persistence as any).prisma.appointment.findFirst({
                where: { workshopId, deletedAt: null },
                orderBy: { dateTime: 'desc' },
                include: { client: true }
            }),
            // Inventory count
            (this.persistence as any).prisma.part.count({
                where: { workshopId, deletedAt: null }
            }),
            // Recent Lists
            (this.persistence as any).prisma.appointment.findMany({
                where: { workshopId, deletedAt: null },
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { client: true }
            }),
            (this.persistence as any).prisma.work.findMany({
                where: { workshopId, deletedAt: null },
                take: 3,
                orderBy: { createdAt: 'desc' }
            }),
            (this.persistence as any).prisma.publication.findMany({
                where: { workshopId, deletedAt: null },
                take: 3,
                orderBy: { createdAt: 'desc' }
            }),
            // Timeline for Chart (last 30 days)
            (this.persistence as any).prisma.work.findMany({
                where: { 
                    workshopId, 
                    deletedAt: null,
                    createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                },
                select: { createdAt: true },
                orderBy: { createdAt: 'asc' }
            })
        ]);

        // Process timeline for chart (Fill gaps with zeros)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const timelineCounts = (worksTimeline as any[]).reduce((acc: any, work) => {
            const day = work.createdAt.toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});

        const timelineData = last30Days.map(date => ({
            date,
            count: timelineCounts[date] || 0
        }));

        return {
            workshop,
            stats: {
                works: {
                    total: (statusCounts as any[]).reduce((a, b) => a + b._count, 0),
                    breakdown: (statusCounts as any[]).reduce((acc, curr) => {
                        acc[curr.status] = curr._count;
                        return acc;
                    }, {} as any)
                },
                appointments: {
                    total: (workshop as any)._count.appointments,
                    last: lastAppointment
                },
                inventory: {
                    total: inventoryCount
                }
            },
            timeline: timelineData,
            recent: {
                appointments: recentAppointments,
                works: recentWorks,
                publications: recentPublications
            }
        };
    }
}
