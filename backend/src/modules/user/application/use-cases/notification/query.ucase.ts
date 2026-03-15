import { Injectable } from "@nestjs/common";
import NotificationModel from "src/modules/user/domain/models/notification.model";
import { FindNotificationPersistence } from "src/modules/user/infrastructure/persistence/notification/notification.persistence";
import { INotificationQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { Notification } from "prisma/generated/client";

@Injectable()
export default class QueryNotificationUCase extends NotificationModel {

    constructor(
        private readonly findPersistence: FindNotificationPersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Notification, INotificationQueryFilter> }) {
        const where = this.getWhere(q.filters || {});

        return await this.findPersistence.getAll({
            where,
            skip: q.skip ? Number(q.skip) : 0,
            take: q.take ? Number(q.take) : 10,
            orderBy: q.orderBy as any
        });
    }
}
