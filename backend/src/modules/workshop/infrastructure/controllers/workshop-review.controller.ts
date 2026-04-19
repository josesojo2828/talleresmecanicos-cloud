import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { WorkshopReviewUCase } from "../../application/use-cases/workshop-review/workshop-review.ucase";
import { ICreateWorkshopReviewDto } from "../../application/dtos/workshop-review.dto";

@Controller('workshop-review')
export class WorkshopReviewController {
    constructor(private readonly useCase: WorkshopReviewUCase) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CLIENT)
    async create(@Body() data: ICreateWorkshopReviewDto, @CurrentUser() user: any) {
        return await this.useCase.create(data, user);
    }

    @Get('workshop/:id')
    async getByWorkshop(@Param('id') workshopId: string) {
        return await this.useCase.findByWorkshop(workshopId);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.useCase.findOne(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async delete(@Param('id') id: string) {
        return await this.useCase.delete(id);
    }
}
