import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IWorkCreateType, IWorkUpdateType, IWorkWhereUniqueType, IWorkWhereType, IWorkOrderByType, IWorkIncludeType, IDefaultWorkInclude } from "../../application/dtos/work.schema";

@Injectable()
export default class WorkPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IWorkCreateType) {
        return await this.prisma.work.create({ data });
    }

    async update(id: string, data: IWorkUpdateType) {
        return await this.prisma.work.update({ where: { id }, data, include: IDefaultWorkInclude });
    }

    async delete(id: string) {
        return await this.prisma.work.delete({ where: { id } });
    }

    async find(where: IWorkWhereUniqueType, include?: IWorkIncludeType) {
        return await this.prisma.work.findUnique({ where, include: include || IDefaultWorkInclude });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IWorkWhereType, orderBy?: IWorkOrderByType, skip?: number, take?: number, include?: IWorkIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.work.count({ where }),
            this.prisma.work.findMany({ where, orderBy, take, skip, include: include || IDefaultWorkInclude })
        ]);
        return { total, data };
    }

    async addPart(workId: string, partId: string, quantity: number) {
        return await this.prisma.workPart.upsert({
            where: { workPartId: { workId, partId } },
            create: { workId, partId, quantity },
            update: { quantity: { increment: quantity } }
        });
    }

    async removePart(workId: string, partId: string) {
        return await this.prisma.workPart.delete({
            where: { workPartId: { workId, partId } }
        });
    }
}
