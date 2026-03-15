export interface IApplicationSocialMedia {
    id: string;
    name: string;
    url: string;
    icon: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
