import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ICityIncludeType, ICityOrderByType, ICityWhereType, ICityWhereUniqueType, IDefaultCityInclude } from "../../../application/dtos/regions.schema";
import { ObjectSelect } from "src/types/support";

@Injectable()
export default class FindCityPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: ICityWhereType, orderBy?: ICityOrderByType, skip?: number, take?: number, include?: ICityIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.city.count({ where }),
            this.prisma.city.findMany({
                where,
                orderBy,
                take,
                skip,
                include: include || IDefaultCityInclude
            })
        ]);

        return {
            total,
            data
        };
    }

    public async find({ where, include }: { where: ICityWhereUniqueType, include?: ICityIncludeType }) {
        return await this.prisma.city.findUnique({
            where,
            include: include || IDefaultCityInclude
        })
    }

    public async select({ where }: { where: ICityWhereType }): Promise<ObjectSelect[]> {
        const entiy = await this.prisma.city.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            skip: 0,
            take: 100,
        })

        if (!entiy || !entiy.length) return [];

        return entiy.map((item) => ({
            id: item.id,
            label: item.name,
        }));
    }
}
