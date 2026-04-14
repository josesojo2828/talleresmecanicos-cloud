import { IPartQueryFilter } from "../../application/dtos/part.schema";

export default class PartModel {
    public model = 'Part';

    public permits = {
        create: 'part:create',
        update: 'part:update',
        delete: 'part:delete',
        read: 'part:read',
        list: 'part:list',
    }

    public getWhere(param: IPartQueryFilter, search?: string): any {
        const wh: any[] = [{ deletedAt: null }];

        if (param.workshopId) wh.push({ workshopId: param.workshopId });
        if (param.categoryId) wh.push({ categoryId: param.categoryId });
        if (param.sku) wh.push({ sku: param.sku });

        if (search) {
            wh.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
