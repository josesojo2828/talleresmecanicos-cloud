import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { WorkshopUCase } from "../../application/use-cases/workshop/workshop.ucase";
import { ICreateWorkshopDto, IUpdateWorkshopDto } from "../../application/dtos/workshop.dto";
import { QueryOptions } from "src/shared/query/input";
import { Workshop, UserRole } from "@prisma/client";
import { IWorkshopQueryFilter } from "../../application/dtos/workshop.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";

@Controller('workshop')
export class WorkshopCrudController {
    constructor(private readonly useCase: WorkshopUCase) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER) // Only Admin can create for anyone, Taller for themselves
    async create(@Body() data: ICreateWorkshopDto, @CurrentUser() user: any) {
        // If Taller, force userId to their own id
        if (user.role === UserRole.TALLER) {
            data.userId = user.id;
        }
        return await this.useCase.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.TALLER)
    async update(@Param('id') id: string, @Body() data: IUpdateWorkshopDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    @Get('mine/get')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.TALLER)
    async getMine(@CurrentUser() user: any) {
        return await this.useCase.pagination({ skip: 0, take: 1, filters: { userId: user.id } }, user);
    }

    @Get('')
    @UseGuards(OptionalAuthGuard)
    async getPaginate(@Query() q: QueryOptions<Workshop, IWorkshopQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user || { role: 'PUBLIC' });
    }
}
