import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IWorkshopCreateType, IWorkshopUpdateType, IWorkshopWhereUniqueType, IWorkshopWhereType, IWorkshopOrderByType, IWorkshopIncludeType, IDefaultWorkshopInclude } from "../../../application/dtos/workshop.schema";
import { ObjectSelect } from "src/types/support";

@Injectable()
export default class WorkshopPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IWorkshopCreateType) {
        return await this.prisma.workshop.create({ data });
    }

    async update(id: string, data: IWorkshopUpdateType) {
        return await this.prisma.workshop.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.workshop.delete({ where: { id } });
    }

    async find(where: IWorkshopWhereUniqueType, include?: IWorkshopIncludeType) {
        return await this.prisma.workshop.findUnique({ where, include: include || IDefaultWorkshopInclude });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IWorkshopWhereType, orderBy?: IWorkshopOrderByType, skip?: number, take?: number, include?: IWorkshopIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.workshop.count({ where }),
            this.prisma.workshop.findMany({ where, orderBy, take, skip, include: include || IDefaultWorkshopInclude })
        ]);
        return { total, data };
    }

    async select(where: IWorkshopWhereType): Promise<ObjectSelect[]> {
        const entities = await this.prisma.workshop.findMany({
            where,
            select: { id: true, name: true },
            take: 100
        });
        return entities.map(item => ({ id: item.id, label: item.name }));
    }
}
