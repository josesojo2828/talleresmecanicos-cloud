import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import WorkshopClientPersistence from "../../infrastructure/persistence/workshop-client.persistence";
import { ICreateWorkshopClientDto, IUpdateWorkshopClientDto, IWorkshopClientFilter } from "../dtos/workshop-client.dto";
import { QueryOptions } from "src/shared/query/input";
import { UserRole } from "@prisma/client";

@Injectable()
export class WorkshopClientUCase {
    constructor(private readonly persistence: WorkshopClientPersistence) { }

    async create(data: ICreateWorkshopClientDto) {
        const { workshopId, userId, name, phone, email } = data;
        
        const body: any = {
            name,
            phone,
            email,
            workshop: { connect: { id: workshopId } }
        };

        if (userId) {
            body.user = { connect: { id: userId } };
        }

        return await this.persistence.create(body);
    }

    async update(id: string, data: IUpdateWorkshopClientDto, user: any) {
        await this.findOne(id, user);
        return await this.persistence.update(id, data);
    }

    async delete(id: string, user: any) {
        await this.findOne(id, user);
        return await this.persistence.delete(id);
    }

    async findOne(id: string, user: any) {
        const entity = await this.persistence.find({ id });
        if (!entity) throw new NotFoundException("Cliente no encontrado");

        if (user.role === UserRole.TALLER && entity.workshopId !== user.workshop?.id) {
            throw new ForbiddenException("No tienes permiso sobre este cliente");
        }

        return entity;
    }

    async pagination(q: QueryOptions<any, IWorkshopClientFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});

        if (user.role === UserRole.TALLER) {
            if (!user.workshop?.id) {
                throw new ForbiddenException("Debes configurar primero tu perfil de taller");
            }
            parsedFilters.workshopId = user.workshop.id;
        }

        const where: any = { ...parsedFilters };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
}
