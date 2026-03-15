import { IProfileQueryFilter, IProfileWhereType } from "../../application/dtos/user.schema";

export default class ProfileModel {

    public model = 'Profile';

    public permits = {
        create: 'profile:create',
        update: 'profile:update',
        delete: 'profile:delete',
        read: 'profile:read',
        list: 'profile:list',
    }

    public events = {
        created: 'profile:created',
        updated: 'profile:updated',
        deleted: 'profile:deleted',
    }

public getWhere(param: IProfileQueryFilter, search?: string): IProfileWhereType {
    const wh: any[] = [];

    if (param.userId) wh.push({ userId: param.userId });

    if (search) {
        wh.push({
            OR: [
                { bio: { contains: search, mode: 'insensitive' } },
                { avatarUrl: { contains: search, mode: 'insensitive' } }
            ]
        });
    }

    return wh.length > 0 ? { AND: {...wh } } : { };
}
}
