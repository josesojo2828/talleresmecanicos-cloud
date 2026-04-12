import { Injectable } from "@nestjs/common";
import { QueryOptions } from "src/shared/query/input";
import { SupportAssignment } from "@prisma/client";
import SupportAssignmentModel from "../../domain/models/support-assignment.model";
import SupportAssignmentPersistence from "../../infrastructure/persistence/assignment/persistence";
import { ICreateSupportAssignmentDto } from "../dtos/support.dto";
import { ISupportAssignmentQueryFilter } from "../dtos/support.schema";

@Injectable()
export class SupportUCase extends SupportAssignmentModel {
    constructor(private readonly persistence: SupportAssignmentPersistence) {
        super();
    }

    async create(data: ICreateSupportAssignmentDto) {
        const { userId, countryId, cityId } = data;
        const body: any = {
            user: { connect: { id: userId } }
        };
        if (countryId) body.country = { connect: { id: countryId } };
        if (cityId) body.city = { connect: { id: cityId } };

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async delete(id: string) {
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async pagination(q: QueryOptions<SupportAssignment, ISupportAssignmentQueryFilter>) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const where = this.getWhere(parsedFilters || {}, search);
        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined
        });
    }
}
