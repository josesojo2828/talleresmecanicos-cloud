import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class VehiclePersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: any) {
        return await this.prisma.vehicle.create({ data });
    }

    async update(id: string, data: any) {
        return await this.prisma.vehicle.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.vehicle.delete({ where: { id } });
    }

    async find(where: any) {
        return await this.prisma.vehicle.findFirst({ where });
    }

    async getAll({ where, orderBy, skip, take }: { where?: any, orderBy?: any, skip?: number, take?: number }) {
        const [total, data] = await Promise.all([
            this.prisma.vehicle.count({ where }),
            this.prisma.vehicle.findMany({ where, orderBy, take, skip })
        ]);
        return { total, data };
    }

    async select({ where }: { where: any }) {
        const data = await this.prisma.vehicle.findMany({
            where,
            select: { id: true, brand: true, model: true }
        });
        return data.map(v => ({ id: v.id, label: `${v.brand} ${v.model}` }));
    }
}

