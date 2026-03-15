import { Injectable, ForbiddenException } from "@nestjs/common";
import VehicleModel from "../../../domain/models/vehicle.model";
import VehiclePersistence from "../../../infrastructure/persistence/vehicle/persistence";
import { CreateVehicleDto, UpdateVehicleDto, VehicleQueryFilter } from "../../dtos/vehicle.dto";
import { QueryOptions } from "src/shared/query/input";

@Injectable()
export class VehicleUCase extends VehicleModel {
    constructor(private readonly persistence: VehiclePersistence) {
        super();
    }

    async create(data: CreateVehicleDto, userId: string) {
        return {
            message: 'success.create',
            data: await this.persistence.create({
                ...data,
                user: { connect: { id: userId } }
            })
        };
    }

    async update(id: string, data: UpdateVehicleDto, user: any) {
        await this.findOne(id, user);
        return {
            message: 'success.update',
            data: await this.persistence.update(id, data)
        };
    }

    async delete(id: string, user: any) {
        await this.findOne(id, user);
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any) {
        const where: any = { id };
        if (user.role === 'CLIENT') where.userId = user.id;
        
        const entity = await this.persistence.find(where);
        if (!entity) throw new ForbiddenException("Vehicle not found or no permission");
        return entity;
    }

    async pagination(q: QueryOptions<any, VehicleQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        
        const wh = this.getWhere(parsedFilters || {}, search);
        if (user.role === 'CLIENT') {
            wh.userId = user.id;
        }

        return await this.persistence.getAll({
            where: wh,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
}
