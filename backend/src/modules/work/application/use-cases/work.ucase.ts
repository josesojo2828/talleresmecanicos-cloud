import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import WorkModel from "../../domain/models/work.model";
import WorkPersistence from "../../infrastructure/persistence/persistence";
import { ICreateWorkDto, IUpdateWorkDto } from "../dtos/work.dto";
import { QueryOptions } from "src/shared/query/input";
import { Work, UserRole } from "@prisma/client";
import { IWorkQueryFilter } from "../dtos/work.schema";

@Injectable()
export class WorkUCase extends WorkModel {
    constructor(private readonly persistence: WorkPersistence) {
        super();
    }

    private generatePublicId(): string {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    async create(data: ICreateWorkDto) {
        const { workshopId, clientId, title, description, images, clientName, clientPhone, vehicleLicensePlate, laborPrice, currency } = data;

        const body: any = {
            title,
            description,
            clientName,
            clientPhone,
            vehicleLicensePlate,
            currency: currency || 'USD',
            laborPrice: laborPrice ? Number(laborPrice) : 0,
            images: (images || []).filter(img => typeof img === 'string'),
            publicId: this.generatePublicId(),
            workshop: { connect: { id: workshopId } },
        };

        if (clientId) {
            body.client = { connect: { id: clientId } };
        }

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async update(id: string, data: IUpdateWorkDto, user: any) {
        await this.findOne(id, user); // Permissions check
        
        const { title, description, status, images, clientName, clientPhone, vehicleLicensePlate, laborPrice, currency } = data;
        const body: any = {};
        
        if (title) body.title = title;
        if (description !== undefined) body.description = description;
        if (status) body.status = status;
        if (clientName !== undefined) body.clientName = clientName;
        if (clientPhone !== undefined) body.clientPhone = clientPhone;
        if (vehicleLicensePlate !== undefined) body.vehicleLicensePlate = vehicleLicensePlate;
        if (laborPrice !== undefined) body.laborPrice = Number(laborPrice);
        if (currency !== undefined) body.currency = currency;
        
        if (images) {
            body.images = (images as any[]).filter(img => typeof img === 'string');
        }

        return {
            message: 'success.update',
            data: await this.persistence.update(id, body)
        };
    }

    async delete(id: string, user: any) {
        await this.findOne(id, user); // Permissions check
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any) {
        const entity = await this.persistence.find({ id });
        if (!entity) throw new NotFoundException("El trabajo no existe");

        // Permission check
        if (!user) {
            // Public access is permitted via findByPublicId
            throw new ForbiddenException("Debe buscar por ID público para acceso sin sesión");
        }

        if (user.role === UserRole.ADMIN || user.role === UserRole.SUPPORT) return entity;
        
        if (user.role === UserRole.TALLER && entity.workshopId !== user.workshop?.id) {
            throw new ForbiddenException("No tienes permiso sobre este trabajo");
        }
        
        if (user.role === UserRole.CLIENT && entity.clientId && entity.clientId !== user.id) {
            throw new ForbiddenException("No tienes permiso sobre este trabajo");
        }

        return entity;
    }

    async findByPublicId(publicId: string, slugTaller: string) {
        const result = await this.persistence.getAll({ 
            where: { 
                publicId,
                workshop: { slug: slugTaller }
            },
            take: 1 
        });

        if (result.total === 0) {
            throw new NotFoundException("El trabajo no existe con esos datos");
        }

        return result.data[0];
    }

    async pagination(q: QueryOptions<Work, IWorkQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});
        
        if (user.role === UserRole.TALLER) {
            parsedFilters.workshopId = user.workshop?.id;
        } else if (user.role === UserRole.CLIENT) {
            parsedFilters.clientId = user.id;
        }

        const where = this.getWhere(parsedFilters, search);

        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
    async addPart(workId: string, partId: string, quantity: number, user: any) {
        await this.findOne(workId, user); // Permissions check
        return await this.persistence.addPart(workId, partId, quantity);
    }

    async removePart(workId: string, partId: string, user: any) {
        await this.findOne(workId, user); // Permissions check
        return await this.persistence.removePart(workId, partId);
    }
}
