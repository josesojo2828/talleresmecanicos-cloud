import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { WorkStatus } from "@prisma/client";

@Injectable()
export class FinanceUCase {
    constructor(private readonly prisma: PrismaService) {}

    async getStats(workshopId: string, start?: string, end?: string) {
        const where: any = {
            workshopId,
            status: { in: [WorkStatus.COMPLETED, WorkStatus.DELIVERED] }
        };

        if (start || end) {
            where.createdAt = {};
            if (start) where.createdAt.gte = new Date(start);
            if (end) where.createdAt.lte = new Date(end);
        }

        // 1. Ingresos por Trabajos (mano de obra y repuestos) + Historial reciente
        const works = await this.prisma.work.findMany({
            where,
            include: {
                partsUsed: {
                    include: {
                        part: true
                    }
                },
                client: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Valor del Inventario Actual (Stock en depósito)
        const inventory = await this.prisma.part.findMany({
            where: { workshopId, deletedAt: null },
            select: { quantity: true, price: true }
        });

        const inventoryValue = inventory.reduce((total, p) => total + ((p.quantity || 0) * (p.price || 0)), 0);

        let totalLabor = 0;
        let totalParts = 0;
        const timeline: Record<string, { labor: number, parts: number }> = {};
        const clients = new Set<string>();

        const recentTransactions = works.slice(0, 5).map(w => {
            const labor = w.laborPrice || 0;
            const partsCost = w.partsUsed.reduce((sum, wp) => sum + ((wp.quantity || 1) * (wp.part?.price || 0)), 0);
            return {
                id: w.id,
                publicId: w.publicId,
                client: w.clientName || w.client?.firstName || 'Consumidor Final',
                date: w.createdAt,
                amount: labor + partsCost,
                status: w.status
            };
        });

        works.forEach(w => {
            const labor = w.laborPrice || 0;
            totalLabor += labor;

            let partsInWork = 0;
            w.partsUsed.forEach(wp => {
                partsInWork += (wp.quantity || 1) * (wp.part?.price || 0);
            });
            totalParts += partsInWork;

            if (w.clientId) clients.add(w.clientId);

            const date = new Date(w.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!timeline[key]) timeline[key] = { labor: 0, parts: 0 };
            timeline[key].labor += labor;
            timeline[key].parts += partsInWork;
        });

        const chartData = Object.entries(timeline).map(([date, values]) => ({
            date,
            ...values,
            total: values.labor + values.parts
        })).sort((a, b) => a.date.localeCompare(b.date));

        return {
            stats: {
                totalIncome: totalLabor + totalParts,
                totalLabor,
                totalParts,
                inventoryValue, // Valor de stock actual
                workCount: works.length,
                uniqueClients: clients.size
            },
            recentTransactions,
            chartData,
            pieData: [
                { name: 'Mano de Obra', value: totalLabor, label: 'Labor' },
                { name: 'Repuestos', value: totalParts, label: 'Parts' }
            ]
        };
    }
}
