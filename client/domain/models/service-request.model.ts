import { ServiceRequestQueryFilter } from "../../application/dtos/service-request.dto";

export default class ServiceRequestModel {
    public model = 'ServiceRequest';

    public permits = {
        create: 'service-request:create',
        update: 'service-request:update',
        delete: 'service-request:delete',
        read: 'service-request:read',
        list: 'service-request:list',
    }

    public getWhere(param: ServiceRequestQueryFilter, search?: string): any {
        const wh: any[] = [];

        if (param.userId) wh.push({ userId: param.userId });
        if (param.status) wh.push({ status: param.status });
        if (param.isSOS !== undefined) {
            const isSOS = String(param.isSOS) === 'true';
            wh.push({ isSOS });
        }

        if (search) {
            wh.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
