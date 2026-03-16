import { BadRequestException, Injectable, ForbiddenException } from "@nestjs/common";
import PublicationModel from "../../../domain/models/publication.model";
import PublicationPersistence from "../../../infrastructure/persistence/publication/persistence";
import { ICreatePublicationDto, IUpdatePublicationDto } from "../../dtos/workshop.dto";
import { QueryOptions } from "src/shared/query/input";
import { Publication, UserRole } from "@prisma/client";
import { IPublicationQueryFilter } from "../../dtos/workshop.schema";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export class PublicationUCase extends PublicationModel {
    constructor(private readonly persistence: PublicationPersistence) {
        super();
    }

    async create(data: ICreatePublicationDto, user: any) {
        const { workshopId, categoryIds, ...rest } = data;
        
        const body: any = {
            ...rest,
            enabled: true,
            user: { connect: { id: user.id } }
        };

        if (workshopId) {
            body.workshop = { connect: { id: workshopId } };
        }

        if (categoryIds && categoryIds.length > 0) {
            body.categories = { connect: categoryIds.map(id => ({ id })) };
        }

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async update(id: string, data: IUpdatePublicationDto, user: any) {
        await this.findOne(id, user, true); 

        const { title, content, images, enabled, categoryIds } = data;
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (images !== undefined) updateData.images = images;
        if (enabled !== undefined) updateData.enabled = enabled;
        if (categoryIds !== undefined) {
            updateData.categories = {
                set: categoryIds.map(id => ({ id }))
            };
        }

        return {
            message: 'success.update',
            data: await this.persistence.update(id, updateData)
        };
    }

    async delete(id: string, user: any) {
        await this.findOne(id, user); 
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any, ignore?: boolean) {
        const scope = getScopeFilter(user);
        const where: any = { id };
        
        if (user && !ignore) {
            if (user.role === UserRole.SUPPORT) {
                where.workshop = scope;
            } else if (user.role === UserRole.TALLER || user.role === UserRole.CLIENT) {
                where.userId = user.id;
            }
        } else {
            where.enabled = true;
        }

        const entity = await this.persistence.find(where);
        if (!entity && (!user || user.role !== UserRole.ADMIN)) throw new ForbiddenException("No tienes permiso o no existe");
        
        return entity;
    }

    async pagination(q: QueryOptions<Publication, IPublicationQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const scope = getScopeFilter(user);
        
        const scopeWhere: any = {};
        if (user) {
            if (user.role === UserRole.SUPPORT) {
                scopeWhere.workshop = scope;
            } else if (user.role === UserRole.TALLER || user.role === UserRole.CLIENT) {
                scopeWhere.userId = user.id;
            }
        } else {
            // Public user
            scopeWhere.enabled = true;
        }

        const where = {
            AND: [
                this.getWhere(parsedFilters || {}, search),
                scopeWhere
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
