import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { WorkshopCategoryUCase } from "../../application/use-cases/workshop-category/workshop-category.ucase";
import { ICreateWorkshopCategoryDto, IUpdateWorkshopCategoryDto } from "../../application/dtos/workshop.dto";
import { QueryOptions } from "src/shared/query/input";
import { WorkshopCategory, UserRole } from "prisma/generated/client";
import { IWorkshopCategoryQueryFilter } from "../../application/dtos/workshop.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";

@Controller('workshop-category')
export class WorkshopCategoryCrudController {
    constructor(private readonly useCase: WorkshopCategoryUCase) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async create(@Body() data: ICreateWorkshopCategoryDto) {
        return await this.useCase.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async update(@Param('id') id: string, @Body() data: IUpdateWorkshopCategoryDto) {
        return await this.useCase.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async delete(@Param('id') id: string) {
        return await this.useCase.delete(id);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.useCase.findOne(id);
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<WorkshopCategory, IWorkshopCategoryQueryFilter>) {
        return await this.useCase.pagination(q);
    }

    @Get('all/select')
    async select(@Query() q: any) {
        return await this.useCase.select(q);
    }
}
