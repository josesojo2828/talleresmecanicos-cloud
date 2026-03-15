import { BadRequestException, Injectable } from "@nestjs/common";
import WorkshopCategoryModel from "../../../domain/models/workshop-category.model";
import WorkshopCategoryPersistence from "../../../infrastructure/persistence/workshop-category/persistence";
import { ICreateWorkshopCategoryDto, IUpdateWorkshopCategoryDto } from "../../dtos/workshop.dto";
import { QueryOptions } from "src/shared/query/input";
import { WorkshopCategory } from "@prisma/client";
import { IWorkshopCategoryQueryFilter } from "../../dtos/workshop.schema";

@Injectable()
export class WorkshopCategoryUCase extends WorkshopCategoryModel {
    constructor(private readonly persistence: WorkshopCategoryPersistence) {
        super();
    }

    async create(data: ICreateWorkshopCategoryDto) {
        return {
            message: 'success.create',
            data: await this.persistence.create(data as any)
        };
    }

    async update(id: string, data: IUpdateWorkshopCategoryDto) {
        const entity = await this.persistence.find({ id });
        if (!entity) throw new BadRequestException("error.not_found");

        return {
            message: 'success.update',
            data: await this.persistence.update(id, data as any)
        };
    }

    async delete(id: string) {
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string) {
        return await this.persistence.find({ id });
    }

    async pagination(q: QueryOptions<WorkshopCategory, IWorkshopCategoryQueryFilter>) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const where = this.getWhere(parsedFilters || { enabled: true }, search);
        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }

    async select(q: any) {
        const where = this.getWhere(q.filters || {}, q.search);
        return await this.persistence.select(where);
    }
}
