import { Injectable } from "@nestjs/common";
import DeviceModel from "src/modules/user/domain/models/device.model";
import { FindDevicePersistence } from "src/modules/user/infrastructure/persistence/device/device.persistence";
import { IDeviceQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { Device } from "prisma/generated/client";

@Injectable()
export default class QueryDeviceUCase extends DeviceModel {

    constructor(
        private readonly findPersistence: FindDevicePersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Device, IDeviceQueryFilter> }) {
        const where = this.getWhere(q.filters || {});

        return await this.findPersistence.getAll({
            where,
            skip: q.skip ? Number(q.skip) : 0,
            take: q.take ? Number(q.take) : 10,
            orderBy: q.orderBy as any
        });
    }
}
