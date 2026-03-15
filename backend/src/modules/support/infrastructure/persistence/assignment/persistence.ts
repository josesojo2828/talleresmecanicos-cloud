import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ISupportAssignmentCreateType, ISupportAssignmentWhereType, ISupportAssignmentOrderByType, ISupportAssignmentIncludeType, IDefaultSupportAssignmentInclude } from "../../../application/dtos/support.schema";

@Injectable()
export default class SupportAssignmentPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: ISupportAssignmentCreateType) {
        return await this.prisma.supportAssignment.create({ data });
    }

    async delete(id: string) {
        return await this.prisma.supportAssignment.delete({ where: { id } });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: ISupportAssignmentWhereType, orderBy?: ISupportAssignmentOrderByType, skip?: number, take?: number, include?: ISupportAssignmentIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.supportAssignment.count({ where }),
            this.prisma.supportAssignment.findMany({ where, orderBy, take, skip, include: include || IDefaultSupportAssignmentInclude })
        ]);
        return { total, data };
    }
}
