import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IForumCommentCreateType, IForumCommentUpdateType, IForumCommentWhereUniqueType, IForumCommentWhereType, IForumCommentOrderByType, IForumCommentIncludeType, IDefaultForumCommentInclude } from "../../../application/dtos/forum.schema";

@Injectable()
export default class ForumCommentPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IForumCommentCreateType) {
        return await this.prisma.forumComment.create({ data });
    }

    async delete(id: string) {
        return await this.prisma.forumComment.delete({ where: { id } });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IForumCommentWhereType, orderBy?: IForumCommentOrderByType, skip?: number, take?: number, include?: IForumCommentIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.forumComment.count({ where }),
            this.prisma.forumComment.findMany({ where, orderBy, take, skip, include: include || IDefaultForumCommentInclude })
        ]);
        return { total, data };
    }
}
