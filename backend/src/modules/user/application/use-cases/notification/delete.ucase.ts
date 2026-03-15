import { BadRequestException, Injectable } from "@nestjs/common";
import NotificationModel from "src/modules/user/domain/models/notification.model";
import { DeleteNotificationPersistence, FindNotificationPersistence } from "src/modules/user/infrastructure/persistence/notification/notification.persistence";

@Injectable()
export default class DeleteNotificationUCase extends NotificationModel {

    constructor(
        private readonly deletePersistence: DeleteNotificationPersistence,
        private readonly findPersistence: FindNotificationPersistence
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
