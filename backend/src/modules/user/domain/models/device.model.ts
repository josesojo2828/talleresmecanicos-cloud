import { IDeviceQueryFilter, IDeviceWhereType } from "../../application/dtos/user.schema";

export default class DeviceModel {

    public model = 'Device';

    public permits = {
        create: 'device:create',
        update: 'device:update',
        delete: 'device:delete',
        read: 'device:read',
        list: 'device:list',
    }

    public events = {
        created: 'device:created',
        updated: 'device:updated',
        deleted: 'device:deleted',
    }

    public getWhere(param: IDeviceQueryFilter, search?: string): IDeviceWhereType {
        const wh: any[] = [];

        if (param.userId) wh.push({ userId: param.userId });
        if (param.deviceId) wh.push({ deviceId: param.deviceId });

        if (search) {
            wh.push({
                OR: [
                    { deviceId: { contains: search, mode: 'insensitive' } },
                    { fcmToken: { contains: search, mode: 'insensitive' } }
                ]
            });
        }

        return wh.length > 0 ? { AND: [...wh, { deletedAt: null }] } : { deletedAt: null };
    }
}
