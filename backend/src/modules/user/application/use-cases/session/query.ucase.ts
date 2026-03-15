import { Injectable } from "@nestjs/common";
import SessionModel from "src/modules/user/domain/models/session.model";
import { FindSessionPersistence } from "src/modules/user/infrastructure/persistence/session/session.persistence";
import { ISessionQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { Session } from "prisma/generated/client";

@Injectable()
export default class QuerySessionUCase extends SessionModel {

    constructor(
        private readonly findPersistence: FindSessionPersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Session, ISessionQueryFilter> }) {
        const where = this.getWhere(q.filters || {});

        return await this.findPersistence.getAll({
            where,
            skip: q.skip ? Number(q.skip) : 0,
            take: q.take ? Number(q.take) : 10,
            orderBy: q.orderBy as any
        });
    }
}
