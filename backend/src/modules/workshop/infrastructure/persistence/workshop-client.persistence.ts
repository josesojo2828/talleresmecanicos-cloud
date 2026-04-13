import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export default class WorkshopClientPersistence {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.WorkshopClientCreateInput) {
        return await this.prisma.workshopClient.create({ data });
    }

    async update(id: string, data: Prisma.WorkshopClientUpdateInput) {
        return await this.prisma.workshopClient.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.workshopClient.delete({ where: { id } });
    }

    async find(where: Prisma.WorkshopClientWhereUniqueInput) {
        return await this.prisma.workshopClient.findUnique({ where });
    }

    async getAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.WorkshopClientWhereInput;
        orderBy?: Prisma.WorkshopClientOrderByWithRelationInput;
    }) {
        const { skip, take, where, orderBy } = params;
        const [data, total] = await Promise.all([
            this.prisma.workshopClient.findMany({
                skip,
                take,
                where,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true
                        }
                    }
                }
            }),
            this.prisma.workshopClient.count({ where })
        ]);

        return { data, total };
    }
}
