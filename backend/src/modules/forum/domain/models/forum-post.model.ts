import { IForumPostQueryFilter, IForumPostWhereType } from "../../application/dtos/forum.schema";

export default class ForumPostModel {
    public model = 'ForumPost';

    public permits = {
        create: 'forum-post:create',
        update: 'forum-post:update',
        delete: 'forum-post:delete',
        read: 'forum-post:read',
        list: 'forum-post:list',
    }

    public getWhere(param: IForumPostQueryFilter, search?: string): IForumPostWhereType {
        const wh: any[] = [];

        if (param.userId) wh.push({ userId: param.userId });
        if (param.workshopId) wh.push({ workshopId: param.workshopId });
        if (param.enabled !== undefined) {
            const isEnabled = String(param.enabled) === 'true';
            wh.push({ enabled: isEnabled });
        }

        // Date Range
        if (param.startDate || param.endDate) {
            const dateFilter: any = {};
            if (param.startDate) dateFilter.gte = new Date(param.startDate);
            if (param.endDate) {
                const end = new Date(param.endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.lte = end;
            }
            wh.push({ createdAt: dateFilter });
        }

        // Categories
        if (param.categoryIds) {
            const ids = Array.isArray(param.categoryIds) ? param.categoryIds : [param.categoryIds];
            wh.push({ categories: { some: { id: { in: ids } } } });
        }

        if (search) {
            const words = search.split(/\s+/).filter(w => w.length > 2);
            const searchConditions = words.map(word => ({
                OR: [
                    { title: { contains: word, mode: 'insensitive' } },
                    { content: { contains: word, mode: 'insensitive' } },
                    { categories: { some: { name: { contains: word, mode: 'insensitive' } } } },
                ]
            }));

            wh.push({
                OR: [
                    ...searchConditions,
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                    { user: { firstName: { contains: search, mode: 'insensitive' } } },
                    { user: { lastName: { contains: search, mode: 'insensitive' } } },
                    { categories: { some: { name: { contains: search, mode: 'insensitive' } } } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
