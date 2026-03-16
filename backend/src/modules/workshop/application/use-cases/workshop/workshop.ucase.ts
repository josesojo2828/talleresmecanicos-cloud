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

    async create(data: ICreateWorkshopDto) {
        const { countryId, cityId, categoryIds, userId, ...rest } = data;

        console.log(data);

        const body: any = {
            ...rest,
            enabled: false, // Default to false as per requirement
            user: { connect: { id: userId } },
            country: { connect: { id: countryId } },
            city: { connect: { id: cityId } },
        };

        if (categoryIds && categoryIds.length > 0) {
            body.categories = {
                connect: categoryIds.map(id => ({ id }))
            };
        }

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async update(id: string, data: IUpdateWorkshopDto, user: any) {
        await this.findOne(id, user); // Verification included in findOne
        
        console.log(data);
        
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
        if (logoUrl !== undefined) body.logoUrl = logoUrl;
        if (images !== undefined) body.images = images;
        if (openingHours !== undefined) body.openingHours = openingHours;
        if (socialMedia !== undefined) body.socialMedia = socialMedia;
        if (enabled !== undefined) body.enabled = enabled;

        if (countryId) body.country = { connect: { id: countryId } };
        if (cityId) body.city = { connect: { id: cityId } };
        
        if (categoryIds && categoryIds.length > 0) {
            body.categories = {
                set: categoryIds.map(id => ({ id }))
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
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const scope = getScopeFilter(user);
        
        const where = {
            AND: [
                this.getWhere(parsedFilters || {}, search),
                user ? scope : { enabled: true }
            ]
        };

        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
}
