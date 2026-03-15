import { BadRequestException, Injectable } from "@nestjs/common";
import DeviceModel from "src/modules/user/domain/models/device.model";
import { UpdateDevicePersistence, FindDevicePersistence } from "src/modules/user/infrastructure/persistence/device/device.persistence";
import { IUpdateDeviceDto } from "src/modules/user/application/dtos/user.dto";
import { IDeviceUpdateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class UpdateDeviceUCase extends DeviceModel {

    constructor(
        private readonly updatePersistence: UpdateDevicePersistence,
        private readonly findPersistence: FindDevicePersistence
    ) {
        super()
    }

    public async execute({ data, id }: { data: IUpdateDeviceDto, id: string }) {
        const { fcmToken } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const body: IDeviceUpdateType = {};
        if (fcmToken) body.fcmToken = fcmToken;

        const entityUpdated = await this.updatePersistence.update({ data: body, id });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
