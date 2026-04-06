
export interface ICreateWorkshopCategoryDto {
    name: string;
    description?: string;
    enabled?: boolean;
}

export interface IUpdateWorkshopCategoryDto {
    name?: string;
    description?: string;
    enabled?: boolean;
}

export interface ICreateWorkshopDto {
    name: string;
    description?: string;
    address: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    logoUrl?: string;
    images?: string[];
    openingHours?: string;
    socialMedia?: any;
    userId: string;
    countryId: string;
    cityId: string;
    categoryIds?: string[];
    enabled?: boolean;
}

export interface IUpdateWorkshopDto {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    logoUrl?: string;
    images?: string[];
    openingHours?: string;
    socialMedia?: any;
    countryId?: string;
    cityId?: string;
    categoryIds?: string[];
    enabled?: boolean;
}

export interface ICreatePublicationDto {
    workshopId?: string;
    title: string;
    content: string;
    images?: string[];
    enabled?: boolean;
    categoryIds?: string[];
}

export interface IUpdatePublicationDto {
    title?: string;
    content?: string;
    images?: string[];
    enabled?: boolean;
    categoryIds?: string[];
    workshopId?: string;
}

