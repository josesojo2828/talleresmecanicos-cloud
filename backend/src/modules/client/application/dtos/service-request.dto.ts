export interface CreateServiceRequestDto {
    title: string;
    description: string;
    images?: string[];
    isSOS?: boolean;
    latitude?: number;
    longitude?: number;
    vehicleId?: string;
}

export interface UpdateServiceRequestStatusDto {
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
}

export interface ServiceRequestQueryFilter {
    userId?: string;
    status?: string;
    isSOS?: boolean;
}
