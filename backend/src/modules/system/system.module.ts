import { Module } from "@nestjs/common";
import { AdminDashboardController } from "./infrastructure/controllers/admin-dashboard.controller";
import { PublicStatsController } from "./infrastructure/controllers/public-stats.controller";
import { AdminMetricsUCase } from "./application/use-cases/admin-metrics.ucase";
import { PrismaService } from "src/config/prisma.service";

@Module({
    controllers: [AdminDashboardController, PublicStatsController],
    providers: [AdminMetricsUCase, PrismaService],
    exports: [AdminMetricsUCase]
})
export class SystemModule {}
