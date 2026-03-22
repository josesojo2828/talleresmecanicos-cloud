import { IWorkQueryFilter } from "../../application/dtos/work.schema";

export default class WorkModel {
    public model = 'Work';

    public permits = {
        create: 'work:create',
        update: 'work:update',
        delete: 'work:delete',
        read: 'work:read',
        list: 'work:list',
    }

    public getWhere(param: IWorkQueryFilter, search?: string): any {
        const wh: any[] = [];

        if (param.workshopId) wh.push({ workshopId: param.workshopId });
        if (param.clientId) wh.push({ clientId: param.clientId });
        if (param.publicId) wh.push({ publicId: param.publicId });
        if (param.status) wh.push({ status: param.status });

        if (search) {
            wh.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { publicId: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
