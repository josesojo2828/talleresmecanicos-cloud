import { IAppointmentQueryFilter } from "../../application/dtos/appointment.schema";

export default class AppointmentModel {
    public model = 'Appointment';

    public permits = {
        create: 'appointment:create',
        update: 'appointment:update',
        delete: 'appointment:delete',
        read: 'appointment:read',
        list: 'appointment:list',
    }

    public getWhere(param: IAppointmentQueryFilter, search?: string): any {
        const wh: any[] = [];

        if (param.workshopId) wh.push({ workshopId: param.workshopId });
        if (param.clientId) wh.push({ clientId: param.clientId });
        if (param.status) wh.push({ status: param.status });
        
        if (param.dateFrom || param.dateTo) {
            const dateFilter: any = {};
            if (param.dateFrom) dateFilter.gte = new Date(param.dateFrom);
            if (param.dateTo) dateFilter.lte = new Date(param.dateTo);
            wh.push({ dateTime: dateFilter });
        }

        if (search) {
            wh.push({
                OR: [
                    { description: { contains: search, mode: 'insensitive' } },
                    { workshop: { name: { contains: search, mode: 'insensitive' } } },
                ]
            });
        }

        return wh.length > 0 ? { AND: wh } : {};
    }
}
