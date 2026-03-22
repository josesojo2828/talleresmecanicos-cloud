import { AppointmentStatus } from "@prisma/client";

export interface ICreateAppointmentDto {
    workshopId: string;
    clientId: string;
    dateTime: string;
    description?: string;
}

export interface IUpdateAppointmentDto {
    dateTime?: string;
    description?: string;
    status?: AppointmentStatus;
}
