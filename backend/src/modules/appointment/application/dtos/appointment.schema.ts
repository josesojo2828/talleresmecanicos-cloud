import { Prisma } from "@prisma/client";

export type IAppointmentCreateType = Prisma.AppointmentCreateInput;
export type IAppointmentUpdateType = Prisma.AppointmentUpdateInput;
export type IAppointmentWhereType = Prisma.AppointmentWhereInput;
export type IAppointmentWhereUniqueType = Prisma.AppointmentWhereUniqueInput;
export type IAppointmentOrderByType = Prisma.AppointmentOrderByWithRelationInput;
export type IAppointmentIncludeType = Prisma.AppointmentInclude;

export const IDefaultAppointmentInclude: IAppointmentIncludeType = {
    workshop: true,
    client: true,
}

export interface IAppointmentQueryFilter {
    workshopId?: string;
    clientId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}
