import { Injectable } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { IUserQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { User } from "prisma/generated/client";

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

    public async pagination({ q }: { q: QueryOptions<User, IUserQueryFilter> }) {
        const { search, filters, skip, take, orderBy } = q as any;

        const where = this.getWhere(filters || {}, search);

        const entity = await this.findPersistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined
        });

        return entity;
    }
}
