import { WorkStatus } from "@prisma/client";

export interface ICreateWorkDto {
    workshopId: string;
    clientId?: string;
    workshopClientId?: string;
    title: string;
    description?: string;
    clientName?: string;
    clientPhone?: string;
    vehicleLicensePlate?: string;
    images?: string[];
    laborPrice?: number;
    currency?: string;
}

export interface IUpdateWorkDto {
    title?: string;
    description?: string;
    status?: WorkStatus;
    clientName?: string;
    clientPhone?: string;
    vehicleLicensePlate?: string;
    workshopClientId?: string;
    images?: string[];
    laborPrice?: number;
    currency?: string;
}
