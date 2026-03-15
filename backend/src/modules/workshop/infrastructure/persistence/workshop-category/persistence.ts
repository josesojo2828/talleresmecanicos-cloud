import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IWorkshopCategoryCreateType, IWorkshopCategoryUpdateType, IWorkshopCategoryWhereUniqueType, IWorkshopCategoryWhereType, IWorkshopCategoryOrderByType, IWorkshopCategoryIncludeType, IDefaultWorkshopCategoryInclude } from "../../../application/dtos/workshop.schema";
import { ObjectSelect } from "src/types/support";

@Injectable()
export default class WorkshopCategoryPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IWorkshopCategoryCreateType) {
        return await this.prisma.workshopCategory.create({ data });
    }

    async update(id: string, data: IWorkshopCategoryUpdateType) {
        return await this.prisma.workshopCategory.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.workshopCategory.delete({ where: { id } });
    }

    async find(where: IWorkshopCategoryWhereUniqueType, include?: IWorkshopCategoryIncludeType) {
        return await this.prisma.workshopCategory.findUnique({ where, include: include || IDefaultWorkshopCategoryInclude });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IWorkshopCategoryWhereType, orderBy?: IWorkshopCategoryOrderByType, skip?: number, take?: number, include?: IWorkshopCategoryIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.workshopCategory.count({ where }),
            this.prisma.workshopCategory.findMany({ where, orderBy, take, skip, include: include || IDefaultWorkshopCategoryInclude })
        ]);
        return { total, data };
    }

    async select(where: IWorkshopCategoryWhereType): Promise<ObjectSelect[]> {
        const entities = await this.prisma.workshopCategory.findMany({
            where,
            select: { id: true, name: true },
            take: 100
        });
        return entities.map(item => ({ id: item.id, label: item.name }));
    }
}
