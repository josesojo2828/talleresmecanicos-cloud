import { VehicleQueryFilter } from "../../application/dtos/vehicle.dto";

export default class VehicleModel {
    public model = 'Vehicle';

    public permits = {
        create: 'vehicle:create',
        update: 'vehicle:update',
        delete: 'vehicle:delete',
        read: 'vehicle:read',
        list: 'vehicle:list',
    }

    public getWhere(param: VehicleQueryFilter, search?: string): any {
        const wh: any[] = [];

        if (param.userId) wh.push({ userId: param.userId });

        if (search) {
            wh.push({
                OR: [
                    { brand: { contains: search, mode: 'insensitive' } },
                    { model: { contains: search, mode: 'insensitive' } },
                    { licensePlate: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
