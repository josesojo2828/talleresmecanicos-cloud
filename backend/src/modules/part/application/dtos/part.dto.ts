export interface ICreatePartDto {
    name: string;
    sku?: string;
    description?: string;
    quantity?: number;
    price?: number;
    workshopId?: string;
    categoryId?: string;
}

export interface IUpdatePartDto {
    name?: string;
    sku?: string;
    description?: string;
    quantity?: number;
    price?: number;
    workshopId?: string;
    categoryId?: string;
}

export interface ICreatePartCategoryDto {
    name: string;
    description?: string;
    workshopId?: string;
}

export interface IUpdatePartCategoryDto {
    name?: string;
    description?: string;
    workshopId?: string;
}
