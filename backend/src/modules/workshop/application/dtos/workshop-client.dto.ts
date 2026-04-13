export interface ICreateWorkshopClientDto {
    name: string;
    phone?: string;
    email?: string;
    userId?: string;
    workshopId?: string; // Set by controller if not admin
}

export interface IUpdateWorkshopClientDto {
    name?: string;
    phone?: string;
    email?: string;
    userId?: string;
}

export interface IWorkshopClientFilter {
    workshopId?: string;
    name?: string;
    phone?: string;
}
