import { Injectable } from "@nestjs/common";
import ProfileModel from "src/modules/user/domain/models/profile.model";
import { FindProfilePersistence } from "src/modules/user/infrastructure/persistence/profile/profile.persistence";
import { IProfileQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { Profile } from "prisma/generated/client";

@Injectable()
export default class QueryProfileUCase extends ProfileModel {

    constructor(
        private readonly findPersistence: FindProfilePersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Profile, IProfileQueryFilter> }) {
        const where = this.getWhere(q.filters || {});

        return await this.findPersistence.getAll({
            where,
            skip: q.skip ? Number(q.skip) : 0,
            take: q.take ? Number(q.take) : 10,
            orderBy: q.orderBy as any
        });
    }
}
