import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { AdminMetricsUCase } from "../../application/use-cases/admin-metrics.ucase";

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminDashboardController {
    constructor(private readonly metricsUCase: AdminMetricsUCase) { }

    @Get('summary')
    async getSummary() {
        return await this.metricsUCase.getDashboardSummary();
    }
}
