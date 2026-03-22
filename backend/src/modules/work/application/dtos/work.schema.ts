import { Prisma } from "@prisma/client";

export type IWorkCreateType = Prisma.WorkCreateInput;
export type IWorkUpdateType = Prisma.WorkUpdateInput;
export type IWorkWhereType = Prisma.WorkWhereInput;
export type IWorkWhereUniqueType = Prisma.WorkWhereUniqueInput;
export type IWorkOrderByType = Prisma.WorkOrderByWithRelationInput;
export type IWorkIncludeType = Prisma.WorkInclude;

export const IDefaultWorkInclude: IWorkIncludeType = {
    workshop: true,
    client: true,
    partsUsed: {
        include: {
            part: {
                include: {
                    category: true
                }
            }
        }
    }
}

export interface IWorkQueryFilter {
    workshopId?: string;
    clientId?: string;
    publicId?: string;
    status?: string;
}
