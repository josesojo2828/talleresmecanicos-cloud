export interface IApplicationObjetives {
    id: string;
    objetivo: string;
    description: string;
    icon: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
