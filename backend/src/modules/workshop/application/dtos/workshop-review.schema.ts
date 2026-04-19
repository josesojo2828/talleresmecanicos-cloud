import { Prisma } from "@prisma/client";

export type IWorkshopReviewCreateType = Prisma.WorkshopReviewCreateInput;
export type IWorkshopReviewUpdateType = Prisma.WorkshopReviewUpdateInput;
export type IWorkshopReviewWhereType = Prisma.WorkshopReviewWhereInput;
export type IWorkshopReviewWhereUniqueType = Prisma.WorkshopReviewWhereUniqueInput;
export type IWorkshopReviewOrderByType = Prisma.WorkshopReviewOrderByWithRelationInput;
export type IWorkshopReviewIncludeType = Prisma.WorkshopReviewInclude;

export const IDefaultWorkshopReviewInclude: IWorkshopReviewIncludeType = {
    user: true,
    workshop: true
}
