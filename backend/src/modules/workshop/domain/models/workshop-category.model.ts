import { IWorkshopCategoryQueryFilter, IWorkshopCategoryWhereType } from "../../application/dtos/workshop.schema";

export default class WorkshopCategoryModel {
    public model = 'WorkshopCategory';

    public permits = {
        create: 'workshop-category:create',
        update: 'workshop-category:update',
        delete: 'workshop-category:delete',
        read: 'workshop-category:read',
        list: 'workshop-category:list',
    }

    public getWhere(param: IWorkshopCategoryQueryFilter, search?: string): IWorkshopCategoryWhereType {
        const wh: any[] = [];

        if (param.enabled !== undefined) {
            const isEnabled = String(param.enabled) === 'true';
            wh.push({ enabled: isEnabled });
        }

        if (search) {
            wh.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
