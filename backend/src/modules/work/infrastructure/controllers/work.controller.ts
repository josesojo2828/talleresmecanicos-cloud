import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { WorkUCase } from "../../application/use-cases/work.ucase";
import { ICreateWorkDto, IUpdateWorkDto } from "../../application/dtos/work.dto";
import { QueryOptions } from "src/shared/query/input";
import { Work, UserRole } from "@prisma/client";
import { IWorkQueryFilter } from "../../application/dtos/work.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('work')
export class WorkController {
    constructor(private readonly useCase: WorkUCase) {}

    // Public Route (No Guard)
    @Get('public/:slugTaller/:publicId')
    async getByPublicId(@Param('slugTaller') slugTaller: string, @Param('publicId') publicId: string) {
        return await this.useCase.findByPublicId(publicId, slugTaller);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async create(@Body() data: ICreateWorkDto, @CurrentUser() user: any) {
        if (user.role === UserRole.TALLER) {
            data.workshopId = user.workshop?.id;
        }
        return await this.useCase.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async update(@Param('id') id: string, @Body() data: IUpdateWorkDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    @Get('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getPaginate(@Query() q: QueryOptions<Work, IWorkQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user);
    }
    @Post(':id/part')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async addPart(@Param('id') id: string, @Body() body: { partId: string, quantity?: number }, @CurrentUser() user: any) {
        return await this.useCase.addPart(id, body.partId, body.quantity || 1, user);
    }

    @Delete(':id/part/:partId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async removePart(@Param('id') id: string, @Param('partId') partId: string, @CurrentUser() user: any) {
        return await this.useCase.removePart(id, partId, user);
    }
}
