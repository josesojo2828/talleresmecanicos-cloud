export interface ICreateWorkshopReviewDto {
    rating: number;
    comment?: string;
    workshopId: string;
}

export interface IUpdateWorkshopReviewDto {
    rating?: number;
    comment?: string;
}
