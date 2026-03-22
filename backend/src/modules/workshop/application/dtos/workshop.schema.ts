import { Prisma } from "@prisma/client";

// Workshop Category
export type IWorkshopCategoryCreateType = Prisma.WorkshopCategoryCreateInput;
export type IWorkshopCategoryUpdateType = Prisma.WorkshopCategoryUpdateInput;
export type IWorkshopCategoryWhereType = Prisma.WorkshopCategoryWhereInput;
export type IWorkshopCategoryWhereUniqueType = Prisma.WorkshopCategoryWhereUniqueInput;
export type IWorkshopCategoryOrderByType = Prisma.WorkshopCategoryOrderByWithRelationInput;
export type IWorkshopCategoryIncludeType = Prisma.WorkshopCategoryInclude;

export const IDefaultWorkshopCategoryInclude: IWorkshopCategoryIncludeType = {
    _count: true
}

export interface IWorkshopCategoryQueryFilter {
    name?: string;
    enabled?: boolean;
}

// Workshop
export type IWorkshopCreateType = Prisma.WorkshopCreateInput;
export type IWorkshopUpdateType = Prisma.WorkshopUpdateInput;
export type IWorkshopWhereType = Prisma.WorkshopWhereInput;
export type IWorkshopWhereUniqueType = Prisma.WorkshopWhereUniqueInput;
export type IWorkshopOrderByType = Prisma.WorkshopOrderByWithRelationInput;
export type IWorkshopIncludeType = Prisma.WorkshopInclude;

export const IDefaultWorkshopInclude: IWorkshopIncludeType = {
    user: true,
    country: true,
    city: true,
    works: true,
    appointments: true,
    _count: {
        select: {
            appointments: true,
            works: true,
            publications: true,
            forumPosts: true,
        }
    }
}

export interface IWorkshopQueryFilter {
    name?: string;
    countryId?: string;
    cityId?: string;
    enabled?: boolean;
    userId?: string;
    categoryIds?: string;
}

// Publication
export type IPublicationCreateType = Prisma.PublicationCreateInput;
export type IPublicationUpdateType = Prisma.PublicationUpdateInput;
export type IPublicationWhereType = Prisma.PublicationWhereInput;
export type IPublicationWhereUniqueType = Prisma.PublicationWhereUniqueInput;
export type IPublicationOrderByType = Prisma.PublicationOrderByWithRelationInput;
export type IPublicationIncludeType = Prisma.PublicationInclude;

export const IDefaultPublicationInclude: IPublicationIncludeType = {
    workshop: true
}

export interface IPublicationQueryFilter {
    categoryIds?: string;
    title?: string;
    workshopId?: string;
    userId?: string;
    enabled?: boolean;
}
