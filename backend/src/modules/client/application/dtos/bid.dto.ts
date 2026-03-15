export interface CreateBidDto {
    amount?: number;
    message: string;
    estimatedTime?: string;
    requestId: string;
}

export interface UpdateBidStatusDto {
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
}

export interface BidQueryFilter {
    workshopId?: string;
    requestId?: string;
    status?: string;
}
