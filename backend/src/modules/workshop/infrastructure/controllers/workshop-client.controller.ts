import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { WorkshopClientUCase } from "../../application/use-cases/workshop-client.ucase";
import { ICreateWorkshopClientDto, IUpdateWorkshopClientDto, IWorkshopClientFilter } from "../../application/dtos/workshop-client.dto";
import { QueryOptions } from "src/shared/query/input";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('workshop-client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkshopClientController {
    constructor(private readonly useCase: WorkshopClientUCase) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async create(@Body() data: ICreateWorkshopClientDto, @CurrentUser() user: any) {
        if (user.role === UserRole.TALLER) {
            data.workshopId = user.workshop?.id;
        }
        return await this.useCase.create(data);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async update(@Param('id') id: string, @Body() data: IUpdateWorkshopClientDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    @Get('')
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async getPaginate(
        @Query() q: QueryOptions<any, IWorkshopClientFilter>,
        @CurrentUser() user: any
    ) {
        return await this.useCase.pagination(q, user);
    }
}
