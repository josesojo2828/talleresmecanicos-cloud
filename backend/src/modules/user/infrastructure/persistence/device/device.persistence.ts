import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IDefaultDeviceInclude, IDeviceCreateType, IDeviceIncludeType, IDeviceOrderByType, IDeviceUpdateType, IDeviceWhereType, IDeviceWhereUniqueType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export class CreateDevicePersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async save({ data }: { data: IDeviceCreateType }) {
        return await this.prisma.device.create({ data });
    }
}

@Injectable()
export class UpdateDevicePersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async update({ id, data }: { id: string, data: IDeviceUpdateType }) {
        return await this.prisma.device.update({ where: { id }, data });
    }
}

@Injectable()
export class DeleteDevicePersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async delete({ id }: { id: string }) {
        return await this.prisma.device.delete({ where: { id } });
    }
}

@Injectable()
export class FindDevicePersistence {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: IDeviceWhereType, orderBy?: IDeviceOrderByType, skip?: number, take?: number, include?: IDeviceIncludeType }) {
        const t = await this.prisma.device.count({ where });
        const data = await this.prisma.device.findMany({
            where,
            orderBy,
            take,
            skip,
            include: include || IDefaultDeviceInclude
        });

        return {
            total: t,
            data
        }
    }

    public async find({ where, include }: { where: IDeviceWhereUniqueType, include?: IDeviceIncludeType }) {
        return await this.prisma.device.findUnique({
            where,
            include: include || IDefaultDeviceInclude
        })
    }
}
