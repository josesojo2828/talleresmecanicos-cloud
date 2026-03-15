import { Prisma } from "@prisma/client";

// Support Assignment
export type ISupportAssignmentCreateType = Prisma.SupportAssignmentCreateInput;
export type ISupportAssignmentUpdateType = Prisma.SupportAssignmentUpdateInput;
export type ISupportAssignmentWhereType = Prisma.SupportAssignmentWhereInput;
export type ISupportAssignmentWhereUniqueType = Prisma.SupportAssignmentWhereUniqueInput;
export type ISupportAssignmentOrderByType = Prisma.SupportAssignmentOrderByWithRelationInput;
export type ISupportAssignmentIncludeType = Prisma.SupportAssignmentInclude;

export const IDefaultSupportAssignmentInclude: ISupportAssignmentIncludeType = {
    user: true,
    country: true,
    city: true,
}

export interface ISupportAssignmentQueryFilter {
    userId?: string;
    countryId?: string;
    cityId?: string;
}
