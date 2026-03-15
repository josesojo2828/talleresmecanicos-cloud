import { BadRequestException, Injectable } from "@nestjs/common";
import NotificationModel from "src/modules/user/domain/models/notification.model";
import { UpdateNotificationPersistence, FindNotificationPersistence } from "src/modules/user/infrastructure/persistence/notification/notification.persistence";
import { IUpdateNotificationDto } from "src/modules/user/application/dtos/user.dto";
import { INotificationUpdateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class UpdateNotificationUCase extends NotificationModel {

    constructor(
        private readonly updatePersistence: UpdateNotificationPersistence,
        private readonly findPersistence: FindNotificationPersistence
    ) {
        super()
    }

    public async execute({ data, id }: { data: IUpdateNotificationDto, id: string }) {
        const { content, isRead, title } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const body: INotificationUpdateType = {};
        if (content) body.content = content;
        if (title) body.title = title;
        if (isRead !== undefined) body.isRead = isRead;

        const entityUpdated = await this.updatePersistence.update({ data: body, id });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
