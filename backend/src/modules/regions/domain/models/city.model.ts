import { ICityQueryFilter, ICityWhereType } from "../../application/dtos/regions.schema";

export default class CityModel {

    public model = 'City';

    public permits = {
        create: 'city:create',
        update: 'city:update',
        delete: 'city:delete',
        read: 'city:read',
        list: 'city:list',
    }

    public events = {
        created: 'city:created',
        updated: 'city:updated',
        deleted: 'city:deleted',
    }

    public getWhere(param: ICityQueryFilter, search?: string): ICityWhereType {
        const wh: any[] = [];

        // 1. Filtros
        if (param.countryId) wh.push({ countryId: param.countryId });
        if (param.country) wh.push({ country: { name: param.country } });
        if (param.enabled !== undefined) {
             const isEnabled = String(param.enabled) === 'true';
             wh.push({ enabled: isEnabled });
        }

        // 2. Búsqueda Global
        if (search) {
            wh.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { country: { name: { contains: search, mode: 'insensitive' } } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
