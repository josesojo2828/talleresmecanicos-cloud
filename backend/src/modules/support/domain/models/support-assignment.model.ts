import { ISupportAssignmentQueryFilter, ISupportAssignmentWhereType } from "../../application/dtos/support.schema";

export default class SupportAssignmentModel {
    public model = 'SupportAssignment';

    public permits = {
        create: 'support-assignment:create',
        update: 'support-assignment:update',
        delete: 'support-assignment:delete',
        read: 'support-assignment:read',
        list: 'support-assignment:list',
    }

    public getWhere(param: ISupportAssignmentQueryFilter, _search?: string): ISupportAssignmentWhereType {
        const wh: any[] = [];

        if (param.userId) wh.push({ userId: param.userId });
        if (param.countryId) wh.push({ countryId: param.countryId });
        if (param.cityId) wh.push({ cityId: param.cityId });

        return wh.length > 0 ? { AND: wh } : {};
    }
}
