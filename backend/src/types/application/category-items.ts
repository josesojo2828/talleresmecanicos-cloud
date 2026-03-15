import { IResource } from "./resource";

export interface ICategoryByItems {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    resources?: IResource[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
