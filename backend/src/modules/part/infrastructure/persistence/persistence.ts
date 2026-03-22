import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class PartPersistence {
    constructor(private readonly prisma: PrismaService) {}

    // PART
    async create(data: any) {
        return await this.prisma.part.create({ data });
    }

    async update(id: string, data: any) {
        return await this.prisma.part.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.part.delete({ where: { id } });
    }

    async find(where: any, include?: any) {
        return await this.prisma.part.findUnique({ 
            where, 
            include: include || { category: true } 
        });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: any, orderBy?: any, skip?: number, take?: number, include?: any }) {
        const [total, data] = await Promise.all([
            this.prisma.part.count({ where }),
            this.prisma.part.findMany({ 
                where, 
                orderBy, 
                take, 
                skip, 
                include: include || { category: true } 
            })
        ]);
        return { total, data };
    }

    // CATEGORY
    async createCategory(data: any) {
        return await this.prisma.partCategory.create({ data });
    }

    async updateCategory(id: string, data: any) {
        return await this.prisma.partCategory.update({ where: { id }, data });
    }

    async deleteCategory(id: string) {
        return await this.prisma.partCategory.delete({ where: { id } });
    }

    async getAllCategories({ where, orderBy, skip, take }: { where?: any, orderBy?: any, skip?: number, take?: number }) {
        const [total, data] = await Promise.all([
            this.prisma.partCategory.count({ where }),
            this.prisma.partCategory.findMany({ where, orderBy, take, skip })
        ]);
        return { total, data };
    }

    async select({ where }: { where: any }): Promise<any[]> {
        const data = await this.prisma.part.findMany({ 
            where, 
            take: 10,
            orderBy: { name: 'asc' } 
        });
        return data.map(i => ({ id: i.id, label: `${i.name} - ${i.sku || 'N/A'}` }));
    }
}
