export interface IQuestion {
    id: string;
    question: string;
    response: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
