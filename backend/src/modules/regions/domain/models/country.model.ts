import { ICountryQueryFilter, ICountryWhereType } from "../../application/dtos/regions.schema";

export default class CountryModel {

    public model = 'Country';

    public permits = {
        create: 'country:create',
        update: 'country:update',
        delete: 'country:delete',
        read: 'country:read',
        list: 'country:list',
    }

    public events = {
        created: 'country:created',
        updated: 'country:updated',
        deleted: 'country:deleted',
    }

    public getWhere(param: ICountryQueryFilter, search?: string): ICountryWhereType {
        const wh: any[] = [];

        // 1. Filtros
        if (param.enabled !== undefined) {
            const isEnabled = String(param.enabled) === 'true';
            wh.push({ enabled: isEnabled });
        }

        // 2. Búsqueda Global
        if (search) {
            wh.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        // We use deletedAt: null by convention if we had soft delete, but I removed it from schema. 
        // Actually, my updated schema DOES NOT have deletedAt for Country and City.
        // Let me check my schema again.
        
        return wh.length > 0 ? { AND: wh } : {};
    }
}
