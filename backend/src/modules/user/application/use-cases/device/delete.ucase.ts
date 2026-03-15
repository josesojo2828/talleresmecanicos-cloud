import { BadRequestException, Injectable } from "@nestjs/common";
import DeviceModel from "src/modules/user/domain/models/device.model";
import { DeleteDevicePersistence, FindDevicePersistence } from "src/modules/user/infrastructure/persistence/device/device.persistence";

@Injectable()
export default class DeleteDeviceUCase extends DeviceModel {

    constructor(
        private readonly deletePersistence: DeleteDevicePersistence,
        private readonly findPersistence: FindDevicePersistence
    ) {
        super()
    }

    public async execute({ id }: { id: string }) {
        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const entityDeleted = await this.deletePersistence.delete({ id });

        return {
            message: 'success.delete',
            data: entityDeleted
        };
    }
}
