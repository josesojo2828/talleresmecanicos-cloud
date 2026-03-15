import { ISessionQueryFilter, ISessionWhereType } from "../../application/dtos/user.schema";

export default class SessionModel {

    public model = 'Session';

    public permits = {
        create: 'session:create',
        update: 'session:update',
        delete: 'session:delete',
        read: 'session:read',
        list: 'session:list',
    }

    public events = {
        created: 'session:created',
        updated: 'session:updated',
        deleted: 'session:deleted',
    }

    public getWhere(param: ISessionQueryFilter, search?: string): ISessionWhereType {
        const wh: any[] = [];

        // 1. Filtros Técnicos (Exactos)
        if (param.userId) wh.push({ userId: param.userId });
        // if (param.status) wh.push({ status: param.status });

        // 2. Búsqueda Global (OR)
        if (search) {
            wh.push({
                OR: [
                    { ipAddress: { contains: search, mode: 'insensitive' } },
                    { userAgent: { contains: search, mode: 'insensitive' } },
                    { token: { contains: search } } // Token usualmente es exacto, pero puede ser like
                ]
            });
        }

        return wh.length > 0 ? { AND: [...wh, { deletedAt: null }] } : { deletedAt: null };
    }
}
