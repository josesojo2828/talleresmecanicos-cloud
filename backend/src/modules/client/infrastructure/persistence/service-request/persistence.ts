import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class ServiceRequestPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: any) {
        return await this.prisma.serviceRequest.create({ data });
    }

    async update(id: string, data: any) {
        return await this.prisma.serviceRequest.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.serviceRequest.delete({ where: { id } });
    }

    async find(where: any) {
        return await this.prisma.serviceRequest.findFirst({ 
            where,
            include: {
                vehicle: true,
                user: { select: { firstName: true, email: true } },
                bids: { include: { workshop: true } }
            }
        });
    }

    async getAll({ where, orderBy, skip, take }: { where?: any, orderBy?: any, skip?: number, take?: number }) {
        const [total, data] = await Promise.all([
            this.prisma.serviceRequest.count({ where }),
            this.prisma.serviceRequest.findMany({ 
                where, 
                orderBy, 
                take, 
                skip,
                include: {
                    vehicle: true,
                    user: { select: { firstName: true } },
                    _count: { select: { bids: true } }
                }
            })
        ]);
        return { total, data };
    }
}
