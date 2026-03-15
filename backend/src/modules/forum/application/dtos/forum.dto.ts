
export interface ICreateForumPostDto {
    title: string;
    content: string;
    images?: string[];
    userId: string;
    workshopId?: string;
    enabled?: boolean;
    categoryIds?: string[];
}

export interface IUpdateForumPostDto {
    title?: string;
    content?: string;
    images?: string[];
    enabled?: boolean;
    categoryIds?: string[];
}

export interface ICreateForumCommentDto {
    content: string;
    rating?: number;
    postId: string;
    userId: string;
    enabled?: boolean;
}

export interface IUpdateForumCommentDto {
    content?: string;
    rating?: number;
    enabled?: boolean;
}

export interface IToggleForumLikeDto {
    postId: string;
    userId: string;
}

export interface IToggleForumFavoriteDto {
    postId: string;
    userId: string;
}
