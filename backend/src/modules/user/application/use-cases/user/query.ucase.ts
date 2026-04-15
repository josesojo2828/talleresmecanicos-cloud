import { Injectable, ForbiddenException } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { IUserQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { User, UserRole } from "@prisma/client";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export default class QueryUserUCase extends UserModel {

    constructor(
        private readonly findPersistence: FindUserPersistence
    ) {
        super()
    }

    public async findOne({ id, user }: { id: string, user: any }) {
        let where: any = { id };

        if (user && user.role === UserRole.SUPPORT) {
            const scope = getScopeFilter(user) as any;
            if (scope && scope.OR) {
                const userFilters = scope.OR.map((f: any) => {
                    if (f.countryId) return { countryId: f.countryId };
                    if (f.cityId) return { 
                        OR: [
                            { cityId: f.cityId },
                            { workshop: { cityId: f.cityId } }
                        ]
                    };
                    return f;
                });
                where = { AND: [{ id }, { OR: userFilters }] };
            }
        }

        const entity = await this.findPersistence.find({ where });
        if (!entity) throw new ForbiddenException("No tienes permiso o no existe este usuario en tu región");
        return entity;
    }

    public async pagination({ q, user }: { q: QueryOptions<User, IUserQueryFilter>, user?: any }) {
        const { search, filters, skip, take, orderBy } = q as any;

        const baseWhere = this.getWhere(filters || {}, search);
        let where: any = { AND: [baseWhere] };

        if (user && user.role === UserRole.SUPPORT) {
            const scope = getScopeFilter(user) as any;
            if (scope && scope.OR) {
                const userFilters = scope.OR.map((f: any) => {
                    if (f.countryId) return { countryId: f.countryId };
                    if (f.cityId) return { 
                        OR: [
                            { cityId: f.cityId },
                            { workshop: { cityId: f.cityId } }
                        ]
                    };
                    return f;
                });
                where.AND.push({ OR: userFilters });
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
