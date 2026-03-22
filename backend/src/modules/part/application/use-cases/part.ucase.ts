import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import PartModel from "../../domain/models/part.model";
import PartCategoryModel from "../../domain/models/part-category.model";
import PartPersistence from "../../infrastructure/persistence/persistence";
import { ICreatePartDto, IUpdatePartDto, ICreatePartCategoryDto, IUpdatePartCategoryDto } from "../dtos/part.dto";
import { QueryOptions } from "src/shared/query/input";
import { UserRole } from "@prisma/client";

@Injectable()
export class PartUCase extends PartModel {
    private categoryModel: PartCategoryModel;

    constructor(private readonly persistence: PartPersistence) {
        super();
        this.categoryModel = new PartCategoryModel();
    }

    // --- PART ---
    async create(data: ICreatePartDto) {
        const { workshopId, categoryId, ...rest } = data;
        const body: any = {
            ...rest,
            workshop: { connect: { id: workshopId } }
        };

        if (categoryId) {
            body.category = { connect: { id: categoryId } };
        }

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async update(id: string, data: IUpdatePartDto, user: any) {
        await this.findOne(id, user);
        const { categoryId, id: _, workshopId, createdAt, updatedAt, deletedAt, category, ...body } = data as any;

        if (categoryId) {
            body.categoryId = categoryId;
        }

        const customBody: IUpdatePartDto = {
            description: data.description,
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            sku: data.sku,
            categoryId: categoryId,
            // category: { connect: { id: categoryId } }
        }

        return {
            message: 'success.update',
            data: await this.persistence.update(id, body)
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
        const entity = await this.persistence.find({ id });
        if (!entity) throw new NotFoundException("La pieza no existe");

        if (user.role === UserRole.ADMIN || user.role === UserRole.SUPPORT) return entity;
        if (user.role === UserRole.TALLER && entity.workshopId !== user.workshop?.id) {
            throw new ForbiddenException("No tienes permiso sobre esta pieza");
        }
        return entity;
    }

    async pagination(q: QueryOptions<any, any>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});

        if (user.role === UserRole.TALLER) {
            parsedFilters.workshopId = user.workshop?.id;
        }

        const where = this.getWhere(parsedFilters, search);

        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }

    // --- CATEGORY ---
    async createCategory(data: ICreatePartCategoryDto) {
        const { workshopId, ...rest } = data;
        const body: any = {
            ...rest,
            workshop: { connect: { id: workshopId } }
        };

        return {
            message: 'success.create',
            data: await this.persistence.createCategory(body)
        };
    }

    async updateCategory(id: string, data: IUpdatePartCategoryDto) {
        const { id: _, workshopId, createdAt, updatedAt, deletedAt, ...body } = data as any;
        return {
            message: 'success.update',
            data: await this.persistence.updateCategory(id, body)
        };
    }

    async paginationCategories(q: QueryOptions<any, any>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});

        if (user.role === UserRole.TALLER) {
            parsedFilters.workshopId = user.workshop?.id;
        }

        const where = this.categoryModel.getWhere(parsedFilters, search);

        return await this.persistence.getAllCategories({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 50,
            orderBy: orderBy as any
        });
    }

    async deleteCategory(id: string, user: any) {
        // Simple delete for now
        return {
            message: 'success.delete',
            data: await this.persistence.deleteCategory(id)
        };
    }
}
