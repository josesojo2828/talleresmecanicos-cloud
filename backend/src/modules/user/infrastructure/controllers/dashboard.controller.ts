import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import DashboardService from "../../application/service/dashboard.service";
import { IUser } from "src/types/user/user";

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('pages')
    async getPages(@CurrentUser() user: IUser) {
        return await this.dashboardService.getPages(user);
    }

    @Get('client-stats')
    @Roles(UserRole.CLIENT)
    async getClientStats(@CurrentUser() user: IUser) {
        return await this.dashboardService.getClientDashboardStats(user);
    }
}
