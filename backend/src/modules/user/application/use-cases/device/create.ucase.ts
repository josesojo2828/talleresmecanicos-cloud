import { Injectable } from "@nestjs/common";
import DeviceModel from "src/modules/user/domain/models/device.model";
import { CreateDevicePersistence } from "src/modules/user/infrastructure/persistence/device/device.persistence";
import { ICreateDeviceDto } from "src/modules/user/application/dtos/user.dto";
import { IDeviceCreateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class CreateDeviceUCase extends DeviceModel {

    constructor(
        private readonly createPersistence: CreateDevicePersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateDeviceDto }) {
        const { deviceId, fcmToken, userId } = data;

        const body: IDeviceCreateType = {
            deviceId,
            fcmToken,
            user: { connect: { id: userId } }
        }

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
