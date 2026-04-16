import { Injectable, ForbiddenException } from "@nestjs/common";
import CityModel from "../../../domain/models/city.model";
import FindCityPersistence from "../../../infrastructure/persistence/city/find.persistence";
import { ICityQueryFilter } from "../../dtos/regions.schema";
import { QueryOptions } from "src/shared/query/input";
import { City, UserRole } from "@prisma/client";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export default class QueryCityUCase extends CityModel {

    constructor(
        private readonly findPersistence: FindCityPersistence
    ) {
        super()
    }

    public async findOne({ id, user }: { id: string, user: any }) {
        const where: any = { id };
        const scope = getScopeFilter(user) as any;
        
        if (user && user.role === UserRole.SUPPORT) {
            // Map cityId to id for City model
            if (scope && scope.OR) {
                const cityFilters = scope.OR.map((f: any) => f.cityId ? { id: f.cityId } : f);
                where.AND = [{ OR: cityFilters }];
            }
        } else if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPPORT) {
            where.enabled = true;
        }

        const entity = await this.findPersistence.find({ where });
        if (!entity) throw new ForbiddenException("No tienes permiso o no existe");
        return entity;
    }

    public async pagination({ q, user }: { q: QueryOptions<City, ICityQueryFilter>, user: any }) {
        const { search, filters, skip, take, orderBy, ...others } = q as any;

        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const combinedFilters = { ...(parsedFilters || {}), ...others };
        const baseWhere = this.getWhere(combinedFilters, search);
        const scope = getScopeFilter(user) as any;
        
        const finalWhere: any = { AND: [baseWhere] };

        if (user && user.role === UserRole.SUPPORT) {
             if (scope && scope.OR) {
                const cityFilters = scope.OR.map((f: any) => f.cityId ? { id: f.cityId } : f);
                finalWhere.AND.push({ OR: cityFilters });
            }
        } else if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPPORT) {
            finalWhere.AND.push({ enabled: true });
        }

        const entity = await this.findPersistence.getAll({
            where: finalWhere,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined
        });

        return entity;
    }
}
