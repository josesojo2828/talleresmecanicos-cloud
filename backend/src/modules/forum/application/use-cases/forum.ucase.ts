import { BadRequestException, Injectable } from "@nestjs/common";
import { QueryOptions } from "src/shared/query/input";
import { ForumPost, ForumComment, UserRole } from "@prisma/client";
import ForumPostModel from "../../domain/models/forum-post.model";
import ForumPostPersistence from "../../infrastructure/persistence/post/persistence";
import ForumCommentPersistence from "../../infrastructure/persistence/forum-comment/persistence";
import { ICreateForumCommentDto, ICreateForumPostDto, IUpdateForumPostDto } from "../dtos/forum.dto";
import { IForumCommentQueryFilter, IForumPostQueryFilter } from "../dtos/forum.schema";
import { PrismaService } from "src/config/prisma.service";
import { getScopeFilter } from "src/shared/utils/scope-filter";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";

@Injectable()
export class ForumUCase extends ForumPostModel {
    constructor(
        private readonly prisma: PrismaService,
        private readonly postPersistence: ForumPostPersistence,
        private readonly commentPersistence: ForumCommentPersistence
    ) {
        super();
    }

    // --- POSTS ---
    async createPost(data: ICreateForumPostDto) {
        const { userId, workshopId, categoryIds, ...rest } = data;
        const body: any = {
            ...rest,
            user: { connect: { id: userId } },
        };
        if (workshopId) body.workshop = { connect: { id: workshopId } };
        if (categoryIds && categoryIds.length > 0) {
            body.categories = { connect: categoryIds.map(id => ({ id })) };
        }

        return {
            message: 'success.create',
            data: await this.postPersistence.create(body)
        };
    }

    async updatePost(id: string, data: IUpdateForumPostDto) {
        const entity = await this.postPersistence.find({ id });
        if (!entity) throw new BadRequestException("error.not_found");

        const { title, content, images, enabled, categoryIds } = data;
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (images !== undefined) updateData.images = images;
        if (enabled !== undefined) updateData.enabled = enabled;
        if (categoryIds !== undefined) {
            updateData.categories = {
                set: categoryIds.map(id => ({ id }))
            };
        }

        return {
            message: 'success.update',
            data: await this.postPersistence.update(id, updateData as any)
        };
    }

    async deletePost(id: string) {
        return {
            message: 'success.delete',
            data: await this.postPersistence.delete(id)
        };
    }

    async findPost(id: string, user?: any) {
        const userId = user?.id;
        const post: any = await this.postPersistence.find({ id }, {
            user: { include: { profile: true } },
            workshop: true,
            comments: {
                where: { enabled: true },
                include: { user: { include: { profile: true } } },
                orderBy: { createdAt: 'desc' }
            },
            _count: {
                select: { likes: true, comments: true, favorites: true }
            }
        });

        if (post && userId) {
            const [liked, favorited] = await Promise.all([
                this.prisma.forumLike.findUnique({ where: { userId_postId: { userId, postId: id } } }),
                this.prisma.forumFavorite.findUnique({ where: { userId_postId: { userId, postId: id } } })
            ]);
            post.isLiked = !!liked;
            post.isFavorited = !!favorited;
        }

        return post;
    }

    async paginationPosts(q: QueryOptions<ForumPost, IForumPostQueryFilter>, user?: any) {
        let { search, filters, skip, take, orderBy } = q;
        const userId = user?.id;
        
        if (typeof filters === 'string') filters = JSON.parse(filters);
        if (typeof orderBy === 'string') orderBy = JSON.parse(orderBy);

        const baseWhere = this.getWhere(filters || {}, search);
        const workScope = getScopeFilter(user, 'workshop');
        
        const finalWhere = {
            AND: [
                baseWhere,
                workScope
            ]
        };
        
        let order: any = orderBy;
        if (!order) {
            order = { createdAt: 'desc' };
        }

        const result: any = await this.postPersistence.getAll({
            where: finalWhere as any,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: order as any,
            include: {
                user: { include: { profile: true } },
                categories: true,
                workshop: { include: { country: true, city: true } },
                _count: {
                    select: { likes: true, comments: true, favorites: true }
                }
            }
        });

        if (userId && result.data.length > 0) {
            const postIds = result.data.map((p: any) => p.id);
            const userLikes = await this.prisma.forumLike.findMany({
                where: { userId, postId: { in: postIds } }
            });
            const likedIds = new Set(userLikes.map(l => l.postId));
            
            result.data = result.data.map((p: any) => ({
                ...p,
                isLiked: likedIds.has(p.id)
            }));
        }

        return result;
    }

    async getRecommendedPosts(take: number = 5, user?: any) {
        const userId = user?.id;
        const workScope = getScopeFilter(user, 'workshop');

        const result: any = await this.postPersistence.getAll({
            where: { 
                enabled: true,
                ...workScope
            },
            take: take,
            orderBy: [
                { likes: { _count: 'desc' } },
                { comments: { _count: 'desc' } },
                { favorites: { _count: 'desc' } }
            ] as any,
            include: {
                user: { include: { profile: true } },
                categories: true,
                _count: {
                    select: { likes: true, comments: true, favorites: true }
                }
            }
        });

        if (userId && result.data.length > 0) {
            const postIds = result.data.map((p: any) => p.id);
            const userLikes = await this.prisma.forumLike.findMany({
                where: { userId, postId: { in: postIds } }
            });
            const likedIds = new Set(userLikes.map(l => l.postId));
            
            result.data = result.data.map((p: any) => ({
                ...p,
                isLiked: likedIds.has(p.id)
            }));
        }

        return result;
    }

    // --- ACTIONS ---
    async toggleLike(userId: string, postId: string) {
        return await this.postPersistence.toggleLike(userId, postId);
    }

    async toggleFavorite(userId: string, postId: string) {
        return await this.postPersistence.toggleFavorite(userId, postId);
    }

    // --- COMMENTS ---
    async createComment(data: ICreateForumCommentDto) {
        const { userId, postId, ...rest } = data;
        const body: any = {
            ...rest,
            user: { connect: { id: userId } },
            post: { connect: { id: postId } }
        };

        return {
            message: 'success.create',
            data: await this.commentPersistence.create(body)
        };
    }

    async deleteComment(id: string) {
        return {
            message: 'success.delete',
            data: await this.commentPersistence.delete(id)
        };
    }

    async getComments(q: QueryOptions<ForumComment, IForumCommentQueryFilter>) {
        let { filters, skip, take, orderBy } = q;

        if (typeof filters === 'string') filters = JSON.parse(filters);
        if (typeof orderBy === 'string') orderBy = JSON.parse(orderBy);

        return await this.commentPersistence.getAll({
            where: filters,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 50,
            orderBy: orderBy as any
        });
    }

    async getStats(user?: any) {
        const userId = user?.id;
        const workScope = getScopeFilter(user, 'workshop');

        if (userId && user.role !== UserRole.SUPPORT) {
            const [posts, approved, favorites] = await Promise.all([
                this.prisma.forumPost.count({ where: { userId } }),
                this.prisma.forumPost.count({ where: { userId, enabled: true } }),
                this.prisma.forumFavorite.count({ where: { userId } })
            ]);
            return { posts, approved, favorites };
        }

        const [totalPosts, totalComments, totalLikes] = await Promise.all([
            this.prisma.forumPost.count({ where: { enabled: true, ...workScope } }),
            this.prisma.forumComment.count({ where: { enabled: true, post: { ...workScope } } }),
            this.prisma.forumLike.count({ where: { post: { ...workScope } } })
        ]);
        return { totalPosts, totalComments, totalLikes };
    }
}
