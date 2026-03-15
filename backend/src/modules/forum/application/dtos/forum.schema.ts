import { Prisma } from "prisma/generated/client";

// Forum Post
export type IForumPostCreateType = Prisma.ForumPostCreateInput;
export type IForumPostUpdateType = Prisma.ForumPostUpdateInput;
export type IForumPostWhereType = Prisma.ForumPostWhereInput;
export type IForumPostWhereUniqueType = Prisma.ForumPostWhereUniqueInput;
export type IForumPostOrderByType = Prisma.ForumPostOrderByWithRelationInput;
export type IForumPostIncludeType = Prisma.ForumPostInclude;

export const IDefaultForumPostInclude: IForumPostIncludeType = {
    user: true,
    workshop: true,
    _count: {
        select: {
            likes: true,
            comments: true,
            favorites: true
        }
    }
}

export interface IForumPostQueryFilter {
    userId?: string;
    workshopId?: string;
    enabled?: boolean;
    startDate?: string;
    endDate?: string;
    categoryIds?: string | string[];
}

// Forum Comment
export type IForumCommentCreateType = Prisma.ForumCommentCreateInput;
export type IForumCommentUpdateType = Prisma.ForumCommentUpdateInput;
export type IForumCommentWhereType = Prisma.ForumCommentWhereInput;
export type IForumCommentWhereUniqueType = Prisma.ForumCommentWhereUniqueInput;
export type IForumCommentOrderByType = Prisma.ForumCommentOrderByWithRelationInput;
export type IForumCommentIncludeType = Prisma.ForumCommentInclude;

export const IDefaultForumCommentInclude: IForumCommentIncludeType = {
    user: true,
    post: false
}

export interface IForumCommentQueryFilter {
    postId?: string;
    userId?: string;
    enabled?: boolean;
    rating?: number;
}
