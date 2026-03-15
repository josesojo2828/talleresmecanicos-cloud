import { INotificationQueryFilter, INotificationWhereType } from "../../application/dtos/user.schema";

export default class NotificationModel {

    public model = 'Notification';

    public permits = {
        create: 'notification:create',
        update: 'notification:update',
        delete: 'notification:delete',
        read: 'notification:read',
        list: 'notification:list',
    }

    public events = {
        created: 'notification:created',
        updated: 'notification:updated',
        deleted: 'notification:deleted',
    }

    public getWhere(param: INotificationQueryFilter, search?: string): INotificationWhereType {
        const wh: any[] = [];

        if (param.userId) wh.push({ userId: param.userId });
        if (param.isRead !== undefined) wh.push({ isRead: param.isRead });

        if (search) {
            wh.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } }
                ]
            });
        }

        return wh.length > 0 ? { AND: [...wh, { deletedAt: null }] } : { deletedAt: null };
    }
}
