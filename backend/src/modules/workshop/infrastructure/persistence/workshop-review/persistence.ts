import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { 
    IWorkshopReviewCreateType, 
    IWorkshopReviewUpdateType, 
    IWorkshopReviewWhereUniqueType, 
    IWorkshopReviewWhereType, 
    IWorkshopReviewOrderByType, 
    IWorkshopReviewIncludeType, 
    IDefaultWorkshopReviewInclude 
} from "../../../application/dtos/workshop-review.schema";

@Injectable()
export default class WorkshopReviewPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IWorkshopReviewCreateType) {
        return await this.prisma.workshopReview.create({ data });
    }

    async update(id: string, data: IWorkshopReviewUpdateType) {
        return await this.prisma.workshopReview.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.workshopReview.delete({ where: { id } });
    }

    async find(where: IWorkshopReviewWhereUniqueType, include?: IWorkshopReviewIncludeType) {
        return await this.prisma.workshopReview.findUnique({ where, include: include || IDefaultWorkshopReviewInclude });
    }

    async findFirst(where: IWorkshopReviewWhereType) {
        return await this.prisma.workshopReview.findFirst({ where });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IWorkshopReviewWhereType, orderBy?: IWorkshopReviewOrderByType, skip?: number, take?: number, include?: IWorkshopReviewIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.workshopReview.count({ where }),
            this.prisma.workshopReview.findMany({ where, orderBy, take, skip, include: include || IDefaultWorkshopReviewInclude })
        ]);
        return { total, data };
    }
}
