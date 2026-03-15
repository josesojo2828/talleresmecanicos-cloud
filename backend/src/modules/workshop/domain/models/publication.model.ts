import { IPublicationQueryFilter, IPublicationWhereType } from "../../application/dtos/workshop.schema";

export default class PublicationModel {
    public model = 'Publication';

    public permits = {
        create: 'publication:create',
        update: 'publication:update',
        delete: 'publication:delete',
        read: 'publication:read',
        list: 'publication:list',
    }

    public getWhere(param: IPublicationQueryFilter, search?: string): IPublicationWhereType {
        const wh: any[] = [];

        if (param.workshopId) wh.push({ workshopId: param.workshopId });
        if (param.userId) wh.push({ userId: param.userId });
        if (param.enabled !== undefined) {
            const isEnabled = String(param.enabled) === 'true';
            wh.push({ enabled: isEnabled });
        }
        if (param.categoryIds) wh.push({ categories: { some: { id: param.categoryIds } } });

        if (search) {
            wh.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
