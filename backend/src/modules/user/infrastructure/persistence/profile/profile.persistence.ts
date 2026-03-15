import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IDefaultProfileInclude, IProfileCreateType, IProfileIncludeType, IProfileOrderByType, IProfileUpdateType, IProfileWhereType, IProfileWhereUniqueType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export class CreateProfilePersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async save({ data }: { data: IProfileCreateType }) {
        return await this.prisma.profile.create({ data });
    }
}

@Injectable()
export class UpdateProfilePersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async update({ id, data }: { id: string, data: IProfileUpdateType }) {
        return await this.prisma.profile.update({ where: { id }, data });
    }
}

@Injectable()
export class DeleteProfilePersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async delete({ id }: { id: string }) {
        return await this.prisma.profile.delete({ where: { id } });
    }
}

@Injectable()
export class FindProfilePersistence {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: IProfileWhereType, orderBy?: IProfileOrderByType, skip?: number, take?: number, include?: IProfileIncludeType }) {
        const t = await this.prisma.profile.count({ where });
        const data = await this.prisma.profile.findMany({
            where,
            orderBy,
            take,
            skip,
            include: include || IDefaultProfileInclude
        });

        return {
            total: t,
            data
        }
    }

    public async find({ where, include }: { where: IProfileWhereUniqueType, include?: IProfileIncludeType }) {
        return await this.prisma.profile.findUnique({
            where,
            include: include || IDefaultProfileInclude
        })
    }
}
