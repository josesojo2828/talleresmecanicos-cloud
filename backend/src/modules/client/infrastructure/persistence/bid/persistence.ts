import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class BidPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: any) {
        return await this.prisma.bid.create({ data });
    }

    async update(id: string, data: any) {
        return await this.prisma.bid.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.bid.delete({ where: { id } });
    }

    async find(where: any) {
        return await this.prisma.bid.findFirst({ 
            where,
            include: {
                workshop: true,
                request: { include: { user: true } }
            }
        });
    }

    async getAll({ where, orderBy, skip, take }: { where?: any, orderBy?: any, skip?: number, take?: number }) {
        const [total, data] = await Promise.all([
            this.prisma.bid.count({ where }),
            this.prisma.bid.findMany({ 
                where, 
                orderBy, 
                take, 
                skip,
                include: {
                    workshop: true
                }
            })
        ]);
        return { total, data };
    }
}
