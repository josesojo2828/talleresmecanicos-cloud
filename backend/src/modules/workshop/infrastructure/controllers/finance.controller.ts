import { Controller, Get, Query, UseGuards, ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { FinanceUCase } from "src/modules/workshop/application/use-cases/finance/finance.ucase";
import WorkshopPersistence from "../persistence/workshop/persistence";

@Controller('workshop/finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
    constructor(
        private readonly useCase: FinanceUCase,
        private readonly workshopPersistence: WorkshopPersistence
    ) {}

    @Get('stats')
    @Roles(UserRole.TALLER, UserRole.ADMIN, UserRole.SUPPORT)
    async getStats(
        @Query('workshopId') workshopId: string,
        @Query('start') start: string,
        @Query('end') end: string,
        @CurrentUser() user: any
    ) {
        // Si es TALLER, verificamos que el taller le pertenezca
        if (user.role === UserRole.TALLER) {
            const workshop = await this.workshopPersistence.find({ userId: user.id });
            if (!workshop) throw new ForbiddenException("No taller asociado al usuario");
            
            // Forzamos el ID del taller del usuario si viene vacío o para seguridad
            if (workshopId && workshopId !== workshop.id) {
                throw new ForbiddenException("No tienes permiso para consultar este taller");
            }
            workshopId = workshop.id;
        }

        if (!workshopId) throw new ForbiddenException("Debe especificar un taller");

        return {
            status: 200,
            message: 'success.finance_stats',
            body: await this.useCase.getStats(workshopId, start, end)
        };
    }
}
