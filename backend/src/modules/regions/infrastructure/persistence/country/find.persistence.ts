import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ICountryIncludeType, ICountryOrderByType, ICountryWhereType, ICountryWhereUniqueType, IDefaultCountryInclude } from "../../../application/dtos/regions.schema";
import { ObjectSelect } from "src/types/support";

@Injectable()
export default class FindCountryPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: ICountryWhereType, orderBy?: ICountryOrderByType, skip?: number, take?: number, include?: ICountryIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.country.count({ where }),
            this.prisma.country.findMany({
                where,
                orderBy,
                take,
                skip,
                include: include || IDefaultCountryInclude
            })
        ]);

        return {
            total,
            data
        };
    }

    public async find({ where, include }: { where: ICountryWhereUniqueType, include?: ICountryIncludeType }) {
        return await this.prisma.country.findUnique({
            where,
            include: include || IDefaultCountryInclude
        })
    }

    public async select({ where }: { where: ICountryWhereType }): Promise<ObjectSelect[]> {
        const entiy = await this.prisma.country.findMany({
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
