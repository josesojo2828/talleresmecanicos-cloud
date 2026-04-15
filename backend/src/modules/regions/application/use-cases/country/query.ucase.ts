import { Injectable, ForbiddenException } from "@nestjs/common";
import CountryModel from "../../../domain/models/country.model";
import FindCountryPersistence from "../../../infrastructure/persistence/country/find.persistence";
import { ICountryQueryFilter } from "../../dtos/regions.schema";
import { QueryOptions } from "src/shared/query/input";
import { Country, UserRole } from "@prisma/client";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export default class QueryCountryUCase extends CountryModel {

    constructor(
        private readonly findPersistence: FindCountryPersistence
    ) {
        super()
    }

    public async findOne({ id, user }: { id: string, user: any }) {
        const where: any = { id };
        const scope = getScopeFilter(user) as any;
        
        if (user && user.role === UserRole.SUPPORT) {
            if (scope && scope.OR) {
                // For Country model, we only care about filters that have countryId 
                // or countries that contain specific assigned cities
                const countryFilters = scope.OR.map((f: any) => {
                    if (f.countryId) return { id: f.countryId };
                    if (f.cityId) return { cities: { some: { id: f.cityId } } };
                    return f;
                });
                where.AND = [{ OR: countryFilters }];
            }
        } else if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPPORT) {
            where.enabled = true;
        }

        const entity = await this.findPersistence.find({ where });
        if (!entity) throw new ForbiddenException("No tienes permiso o no existe");
        return entity;
    }

    public async pagination({ q, user }: { q: QueryOptions<Country, ICountryQueryFilter>, user: any }) {
        const { search, filters, skip, take, orderBy } = q as any;

        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const baseWhere = this.getWhere(parsedFilters || {}, search);
        const scope = getScopeFilter(user) as any;
        
        const finalWhere: any = { AND: [baseWhere] };

        if (user && user.role === UserRole.SUPPORT) {
            if (scope && scope.OR) {
                const countryFilters = scope.OR.map((f: any) => {
                    if (f.countryId) return { id: f.countryId };
                    if (f.cityId) return { cities: { some: { id: f.cityId } } };
                    return f;
                });
                finalWhere.AND.push({ OR: countryFilters });
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
