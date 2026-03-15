import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IDefaultSessionInclude, ISessionCreateType, ISessionIncludeType, ISessionOrderByType, ISessionUpdateType, ISessionWhereType, ISessionWhereUniqueType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export class CreateSessionPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async save({ data }: { data: ISessionCreateType }) {
        return await this.prisma.session.create({ data });
    }
}

@Injectable()
export class UpdateSessionPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async update({ id, data }: { id: string, data: ISessionUpdateType }) {
        return await this.prisma.session.update({ where: { id }, data });
    }
}

@Injectable()
export class DeleteSessionPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async delete({ id }: { id: string }) {
        return await this.prisma.session.delete({ where: { id } });
    }
}

@Injectable()
export class FindSessionPersistence {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: ISessionWhereType, orderBy?: ISessionOrderByType, skip?: number, take?: number, include?: ISessionIncludeType }) {
        const t = await this.prisma.session.count({ where });
        const data = await this.prisma.session.findMany({
            where,
            orderBy,
            take,
            skip,
            include: include || IDefaultSessionInclude
        });

        return {
            total: t,
            data
        }
    }

    public async find({ where, include }: { where: ISessionWhereUniqueType, include?: ISessionIncludeType }) {
        return await this.prisma.session.findUnique({
            where,
            include: include || IDefaultSessionInclude
        })
    }
}
