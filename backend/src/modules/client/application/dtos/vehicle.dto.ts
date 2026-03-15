export interface CreateVehicleDto {
    brand: string;
    model: string;
    year?: number;
    licensePlate?: string;
    lastOilChange?: Date;
}

export interface UpdateVehicleDto {
    brand?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    lastOilChange?: Date;
}

export interface VehicleQueryFilter {
    userId?: string;
}
