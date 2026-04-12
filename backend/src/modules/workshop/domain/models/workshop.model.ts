import { IWorkshopQueryFilter, IWorkshopWhereType } from "../../application/dtos/workshop.schema";

export default class WorkshopModel {
    public model = 'Workshop';

    public permits = {
        create: 'workshop:create',
        update: 'workshop:update',
        delete: 'workshop:delete',
        read: 'workshop:read',
        list: 'workshop:list',
    }

    public getWhere(param: IWorkshopQueryFilter, search?: string): IWorkshopWhereType {
        const wh: any[] = [];

        if (param.countryId) wh.push({ countryId: param.countryId });
        if (param.cityId) wh.push({ cityId: param.cityId });
        if (param.slug) wh.push({ slug: param.slug });
        if (param.enabled !== undefined) {
            const isEnabled = String(param.enabled) === 'true';
            wh.push({ enabled: isEnabled });
        }
        if (param.userId) wh.push({ userId: param.userId });
        if (param.categoryIds) wh.push({ WorkshopToCategory: { some: { B: param.categoryIds } } });

        if (search) {
            wh.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { address: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
