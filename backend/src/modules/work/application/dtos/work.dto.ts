import { WorkStatus } from "@prisma/client";

export interface ICreateWorkDto {
    workshopId: string;
    clientId?: string;
    title: string;
    description?: string;
    clientName?: string;
    clientPhone?: string;
    vehicleLicensePlate?: string;
    images?: string[];
}

export interface IUpdateWorkDto {
    title?: string;
    description?: string;
    status?: WorkStatus;
    clientName?: string;
    clientPhone?: string;
    vehicleLicensePlate?: string;
    images?: string[];
}
