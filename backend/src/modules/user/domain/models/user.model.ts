import { IUserRole } from "src/types/enums";
import { IUserQueryFilter, IUserWhereType } from "../../application/dtos/user.schema";

export default class UserModel {

    public model = 'User';

    public permits = {
        create: 'user:create',
        update: 'user:update',
        delete: 'user:delete',
        read: 'user:read',
        list: 'user:list',
    }

    public events = {
        created: 'user:created',
        updated: 'user:updated',
        deleted: 'user:deleted',
    }

    public getWhere(param: IUserQueryFilter, search?: string): IUserWhereType {
        const wh: any[] = [];

        // 1. Filtros específicos
        if (param.role) wh.push({ role: (param.role as IUserRole) });
        if (param.enabled !== undefined) wh.push({ enabled: param.enabled });

        // 2. Búsqueda Global
        if (search) {
            wh.push({
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
