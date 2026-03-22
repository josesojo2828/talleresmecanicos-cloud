export default class PartCategoryModel {
    public model = 'PartCategory';

    public permits = {
        create: 'part-category:create',
        update: 'part-category:update',
        delete: 'part-category:delete',
        read: 'part-category:read',
        list: 'part-category:list',
    }

    public getWhere(param: any, search?: string): any {
        const wh: any[] = [];

        if (param.workshopId) wh.push({ workshopId: param.workshopId });

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
