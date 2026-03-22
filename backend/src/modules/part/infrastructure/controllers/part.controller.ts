import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PartUCase } from "../../application/use-cases/part.ucase";
import { ICreatePartDto, IUpdatePartDto, ICreatePartCategoryDto, IUpdatePartCategoryDto } from "../../application/dtos/part.dto";
import { QueryOptions } from "src/shared/query/input";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('part')
export class PartController {
    constructor(private readonly useCase: PartUCase) {}

    // --- PARTS ---
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async create(@Body() data: ICreatePartDto, @CurrentUser() user: any) {
        if (user.role === UserRole.TALLER) {
            data.workshopId = user.workshop?.id;
        }
        return await this.useCase.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async update(@Param('id') id: string, @Body() data: IUpdatePartDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getPaginate(@Query() q: QueryOptions<any, any>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    // --- CATEGORIES ---
    @Post('category')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async createCategory(@Body() data: ICreatePartCategoryDto, @CurrentUser() user: any) {
        if (user.role === UserRole.TALLER) {
            data.workshopId = user.workshop?.id;
        }
        return await this.useCase.createCategory(data);
    }

    @Put('category/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async updateCategory(@Param('id') id: string, @Body() data: IUpdatePartCategoryDto, @CurrentUser() user: any) {
        return await this.useCase.updateCategory(id, data);
    }

    @Get('category/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getPaginateCategories(@Query() q: QueryOptions<any, any>, @CurrentUser() user: any) {
        return await this.useCase.paginationCategories(q, user);
    }

    @Delete('category/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async deleteCategory(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.deleteCategory(id, user);
    }
}
