export interface ICreateCountryDto {
    name: string;
    enabled?: boolean;
    flag?: string;
}

export interface IUpdateCountryDto {
    name?: string;
    enabled?: boolean;
    flag?: string;
}

export interface ICreateCityDto {
    name: string;
    countryId: string;
    enabled?: boolean;
}

export interface IUpdateCityDto {
    name?: string;
    countryId?: string;
    enabled?: boolean;
}
