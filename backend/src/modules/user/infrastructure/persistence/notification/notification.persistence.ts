import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IDefaultNotificationInclude, INotificationCreateType, INotificationIncludeType, INotificationOrderByType, INotificationUpdateType, INotificationWhereType, INotificationWhereUniqueType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export class CreateNotificationPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async save({ data }: { data: INotificationCreateType }) {
        return await this.prisma.notification.create({ data });
    }
}

@Injectable()
export class UpdateNotificationPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async update({ id, data }: { id: string, data: INotificationUpdateType }) {
        return await this.prisma.notification.update({ where: { id }, data });
    }
}

@Injectable()
export class DeleteNotificationPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async delete({ id }: { id: string }) {
        return await this.prisma.notification.delete({ where: { id } });
    }
}

@Injectable()
export class FindNotificationPersistence {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: INotificationWhereType, orderBy?: INotificationOrderByType, skip?: number, take?: number, include?: INotificationIncludeType }) {
        const t = await this.prisma.notification.count({ where });
        const data = await this.prisma.notification.findMany({
            where,
            orderBy,
            take,
            skip,
            include: include || IDefaultNotificationInclude
        });

        return {
            total: t,
            data
        }
    }

    public async find({ where, include }: { where: INotificationWhereUniqueType, include?: INotificationIncludeType }) {
        return await this.prisma.notification.findUnique({
            where,
            include: include || IDefaultNotificationInclude
        })
    }
}
