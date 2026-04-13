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
        console.log('[PublicationUCase] Create Request by user:', user.email, 'Role:', user.role);
        const { workshopId, categoryIds, ...rest } = data;
        
        // Determinar el workshopId si no viene en el body
        const effectiveWorkshopId = (user.role === UserRole.TALLER) ? (user.workshop?.id || workshopId) : workshopId;
        console.log('[PublicationUCase] Effective Workshop ID assigned:', effectiveWorkshopId);


        const body: any = {
            ...rest,
            enabled: true,
            user: { connect: { id: user.id } }
        };

        if (effectiveWorkshopId) {
            body.workshop = { connect: { id: effectiveWorkshopId } };
        }

        if (categoryIds && categoryIds.length > 0) {
            body.categories = { connect: categoryIds.map(id => ({ id })) };
        }

        const result = await this.persistence.create(body);
        console.log('[PublicationUCase] Creation Successful. Publication ID:', result.id);
        
        return {
            message: 'success.create',
            data: result
        };
    }

    async update(id: string, data: IUpdatePublicationDto, user: any) {
        console.log('[PublicationUCase] Update Request for ID:', id, 'by User:', user.email);
        await this.findOne(id, user, true); 

        const { title, content, images, enabled, categoryIds, workshopId } = data;
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (images !== undefined) updateData.images = images;
        if (enabled !== undefined) updateData.enabled = enabled;
        
        if (workshopId !== undefined) {
             updateData.workshop = { connect: { id: workshopId } };
        }

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
        console.log('[PublicationUCase] Delete Request for ID:', id, 'by User:', user.email);
        await this.findOne(id, user); 
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any, ignore?: boolean) {
        const where: any = { id, ...getScopeFilter(user, 'workshop') };
        
        if (user && !ignore && user.role !== UserRole.ADMIN) {
            if (user.role === UserRole.TALLER) {
                where.workshopId = user.workshop?.id;
                delete where.workshop; // Override geographic filter
            } else if (user.role === UserRole.CLIENT) {
                where.userId = user.id;
                delete where.workshop; // Override geographic filter
            }
        }

        const entity = await this.persistence.find(where);
        if (!entity) throw new ForbiddenException("No tienes permiso o el registro no existe");
        
        return entity;
    }



    async pagination(q: QueryOptions<Publication, IPublicationQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        
        const scopeWhere: any = getScopeFilter(user, 'workshop');
        
        if (user && user.role !== UserRole.ADMIN) {
            if (user.role === UserRole.TALLER) {
                if (!user.workshop?.id) {
                    throw new ForbiddenException("Debes configurar primero tu perfil de taller");
                }
                scopeWhere.workshopId = user.workshop.id;
                delete scopeWhere.workshop; // Override geographic filter with specific workshop ownership
            } else if (user.role === UserRole.CLIENT) {
                scopeWhere.userId = user.id;
                delete scopeWhere.workshop; // Override geographic filter with user ownership
            }
        }


        const where = {
            AND: [
                this.getWhere(parsedFilters || {}, search),
                scopeWhere
            ].filter(p => Object.keys(p).length > 0)
        };

        const result = await this.persistence.getAll({
            where: where as any,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });

        return result;
    }


}
