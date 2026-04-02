import { Controller, Get } from "@nestjs/common";
import { AdminMetricsUCase } from "../../application/use-cases/admin-metrics.ucase";

@Controller('public')
export class PublicStatsController {
    constructor(private readonly metricsUcase: AdminMetricsUCase) {}

    @Get('stats')
    async getPublicStats() {
        return await this.metricsUcase.getPublicStats();
    }
}
