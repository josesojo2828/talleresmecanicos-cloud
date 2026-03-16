import { BidQueryFilter } from "../../application/dtos/bid.dto";

export default class BidModel {
    public model = 'Bid';

    public permits = {
        create: 'bid:create',
        update: 'bid:update',
        delete: 'bid:delete',
        read: 'bid:read',
        list: 'bid:list',
    }

    public getWhere(param: BidQueryFilter, search?: string): any {
        const wh: any[] = [];

        if (param.workshopId) wh.push({ workshopId: param.workshopId });
        if (param.requestId) wh.push({ requestId: param.requestId });
        if (param.status) wh.push({ status: param.status });

        if (search) {
            wh.push({
                OR: [
                    { message: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
