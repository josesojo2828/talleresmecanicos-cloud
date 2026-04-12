import { Injectable } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { IUserQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { User } from "@prisma/client";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export default class QueryUserUCase extends UserModel {

    constructor(
        private readonly findPersistence: FindUserPersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q, user }: { q: QueryOptions<User, IUserQueryFilter>, user?: any }) {
        const { search, filters, skip, take, orderBy } = q as any;

        let where = this.getWhere(filters || {}, search);

        if (user && user.role === 'SUPPORT') {
            const assignments = user.assignments || [];
            if (assignments.length === 0) {
                where = { ...where, id: 'none' };
            } else {
                // User only has countryId, NOT cityId.
                // For country assignments -> filter directly by countryId
                // For city assignments -> find the country of those cities via relation
                const countryIds = [...new Set(
                    assignments.map((a: any) => a.countryId).filter((id: any) => id != null)
                )] as string[];

                const cityIds = [...new Set(
                    assignments.map((a: any) => a.cityId).filter((id: any) => id != null)
                )] as string[];

                const orFilters: any[] = [];
                if (countryIds.length > 0) {
                    orFilters.push({ countryId: { in: countryIds } });
                }
                if (cityIds.length > 0) {
                    // Users whose country has one of the assigned cities
                    orFilters.push({ country: { cities: { some: { id: { in: cityIds } } } } });
                }

                if (orFilters.length > 0) {
                    where = { ...where, OR: orFilters };
                } else {
                    where = { ...where, id: 'none' };
                }
            }
        }

        const entity = await this.findPersistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined
        });

        return entity;
    }
}
