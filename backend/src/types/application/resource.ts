import { ICategoryByItems } from "./category-items";

export interface IResource {
    id: string;
    name: string;
    description?: string | null;
    enabled: boolean;
    categoryId: string;
    category?: ICategoryByItems;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
