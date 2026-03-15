import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IForumPostCreateType, IForumPostUpdateType, IForumPostWhereUniqueType, IForumPostWhereType, IForumPostOrderByType, IForumPostIncludeType, IDefaultForumPostInclude } from "../../../application/dtos/forum.schema";

@Injectable()
export default class ForumPostPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IForumPostCreateType) {
        return await this.prisma.forumPost.create({ data });
    }

    async update(id: string, data: IForumPostUpdateType) {
        return await this.prisma.forumPost.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.forumPost.delete({ where: { id } });
    }

    async find(where: IForumPostWhereUniqueType, include?: IForumPostIncludeType) {
        return await this.prisma.forumPost.findUnique({ where, include: include || IDefaultForumPostInclude });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IForumPostWhereType, orderBy?: IForumPostOrderByType, skip?: number, take?: number, include?: IForumPostIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.forumPost.count({ where }),
            this.prisma.forumPost.findMany({ where, orderBy, take, skip, include: include || IDefaultForumPostInclude })
        ]);
        return { total, data };
    }

    // Likes & Favorites logic
    async toggleLike(userId: string, postId: string) {
        const existing = await this.prisma.forumLike.findUnique({
            where: { userId_postId: { userId, postId } }
        });
        if (existing) {
            await this.prisma.forumLike.delete({ where: { userId_postId: { userId, postId } } });
            return { action: 'removed' };
        } else {
            await this.prisma.forumLike.create({ data: { userId, postId } });
            return { action: 'added' };
        }
    }

    async toggleFavorite(userId: string, postId: string) {
        const existing = await this.prisma.forumFavorite.findUnique({
            where: { userId_postId: { userId, postId } }
        });
        if (existing) {
            await this.prisma.forumFavorite.delete({ where: { userId_postId: { userId, postId } } });
            return { action: 'removed' };
        } else {
            await this.prisma.forumFavorite.create({ data: { userId, postId } });
            return { action: 'added' };
        }
    }
}
