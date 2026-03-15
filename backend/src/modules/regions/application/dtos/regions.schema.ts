import { Prisma } from "prisma/generated/client";

// ###################################
//      SCHEMA TYPES
// ###################################

// Country
export type ICountryCreateType = Prisma.CountryCreateInput;
export type ICountryUpdateType = Prisma.CountryUpdateInput;
export type ICountryWhereType = Prisma.CountryWhereInput;
export type ICountryWhereUniqueType = Prisma.CountryWhereUniqueInput;
export type ICountryOrderByType = Prisma.CountryOrderByWithRelationInput;
export type ICountryIncludeType = Prisma.CountryInclude;

export const IDefaultCountryInclude: ICountryIncludeType = {
    cities: true,
    workshops: false,
    supportAssignments: false,
}

export interface ICountryQueryFilter {
    name?: string;
    enabled?: boolean;
}

// City
export type ICityCreateType = Prisma.CityCreateInput;
export type ICityUpdateType = Prisma.CityUpdateInput;
export type ICityWhereType = Prisma.CityWhereInput;
export type ICityWhereUniqueType = Prisma.CityWhereUniqueInput;
export type ICityOrderByType = Prisma.CityOrderByWithRelationInput;
export type ICityIncludeType = Prisma.CityInclude;

export const IDefaultCityInclude: ICityIncludeType = {
    country: true,
    workshops: false,
    supportAssignments: false,
}

export interface ICityQueryFilter {
    name?: string;
    countryId?: string;
    enabled?: boolean;
}
