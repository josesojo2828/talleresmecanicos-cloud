import { Controller, Get, UseGuards, Param } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { AdminMetricsUCase } from "../../application/use-cases/admin-metrics.ucase";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPPORT)
export class AdminDashboardController {
    constructor(private readonly metricsUCase: AdminMetricsUCase) { }

    @Get('summary')
    async getSummary(@CurrentUser() user: any) {
        return await this.metricsUCase.getDashboardSummary(user);
    }

    @Get('/workshop/:workshopId')
    async getWorkshopDashboardById(@Param('workshopId') workshopId: string, @CurrentUser() user: any) {
        return await this.metricsUCase.getWorkshopDashboard(workshopId);
    }
}
