import { Injectable, ForbiddenException } from "@nestjs/common";
import ServiceRequestModel from "../../../domain/models/service-request.model";
import ServiceRequestPersistence from "../../../infrastructure/persistence/service-request/persistence";
import { CreateServiceRequestDto, UpdateServiceRequestStatusDto, ServiceRequestQueryFilter } from "../../dtos/service-request.dto";
import { QueryOptions } from "src/shared/query/input";

@Injectable()
export class ServiceRequestUCase extends ServiceRequestModel {
    constructor(private readonly persistence: ServiceRequestPersistence) {
        super();
    }

    async create(data: CreateServiceRequestDto, userId: string) {
        const { vehicleId, ...rest } = data;
        const body: any = {
            ...rest,
            user: { connect: { id: userId } }
        };

        if (vehicleId) {
            body.vehicle = { connect: { id: vehicleId } };
        }

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async updateStatus(id: string, data: UpdateServiceRequestStatusDto, user: any) {
        const entity = await this.findOne(id, user);
        
        // Only owner or admin can update status
        if (user.role === 'CLIENT' && entity.userId !== user.id) {
            throw new ForbiddenException("No permission");
        }

        return {
            message: 'success.update',
            data: await this.persistence.update(id, { status: data.status })
        };
    }

    async delete(id: string, user: any) {
        const entity = await this.findOne(id, user);
        if (user.role === 'CLIENT' && entity.userId !== user.id) {
            throw new ForbiddenException("No permission");
        }
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any) {
        // Anyone can see a request? Maybe workshops need to see open requests
        const entity = await this.persistence.find({ id });
        if (!entity) throw new ForbiddenException("Request not found");
        return entity;
    }

    async pagination(q: QueryOptions<any, ServiceRequestQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});
        
        const wh = this.getWhere(parsedFilters, search);
        
        // If client, usually they see their own, UNLESS it's an SOS overview?
        // Let's keep it simple: if filtering by userId, use it.
        // For workshops, they see all OPEN requests in their area?
        
        return await this.persistence.getAll({
            where: wh,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
}
