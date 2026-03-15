export interface IMessagesInToWeb {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
