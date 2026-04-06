import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IPublicationCreateType, IPublicationUpdateType, IPublicationWhereUniqueType, IPublicationWhereType, IPublicationOrderByType, IPublicationIncludeType, IDefaultPublicationInclude } from "../../../application/dtos/workshop.schema";

@Injectable()
export default class PublicationPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IPublicationCreateType) {
        console.log('[PublicationPersistence] Creating publication with data:', JSON.stringify(data, null, 2));
        const result = await this.prisma.publication.create({ data });
        console.log('[PublicationPersistence] Created correctly:', result.id);
        return result;
    }

    async update(id: string, data: IPublicationUpdateType) {
        return await this.prisma.publication.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.publication.delete({ where: { id } });
    }

    async find(where: any, include?: IPublicationIncludeType) {
        return await this.prisma.publication.findFirst({ where, include: include || IDefaultPublicationInclude });
    }


    async getAll({ where, orderBy, skip, take, include }: { where?: IPublicationWhereType, orderBy?: IPublicationOrderByType, skip?: number, take?: number, include?: IPublicationIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.publication.count({ where }),
            this.prisma.publication.findMany({ where, orderBy, take, skip, include: include || IDefaultPublicationInclude })
        ]);
        return { total, data };
    }
}
