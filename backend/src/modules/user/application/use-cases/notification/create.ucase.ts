import { Injectable } from "@nestjs/common";
import NotificationModel from "src/modules/user/domain/models/notification.model";
import { CreateNotificationPersistence } from "src/modules/user/infrastructure/persistence/notification/notification.persistence";
import { ICreateNotificationDto } from "src/modules/user/application/dtos/user.dto";
import { INotificationCreateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class CreateNotificationUCase extends NotificationModel {

    constructor(
        private readonly createPersistence: CreateNotificationPersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateNotificationDto }) {
        const { content, title, userId } = data;

        const body: INotificationCreateType = {
            content,
            title,
            user: { connect: { id: userId } }
        }

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
