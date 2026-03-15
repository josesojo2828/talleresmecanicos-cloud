import { Body, Controller, Delete, Get, Param, Post, Patch, Query, UseGuards } from "@nestjs/common";
import { ServiceRequestUCase } from "../../../application/use-cases/service-request/service-request.ucase";
import { CreateServiceRequestDto, UpdateServiceRequestStatusDto, ServiceRequestQueryFilter } from "../../../application/dtos/service-request.dto";
import { QueryOptions } from "src/shared/query/input";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('service-request')
export class ServiceRequestController {
    constructor(private readonly useCase: ServiceRequestUCase) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENT')
    async create(@Body() data: CreateServiceRequestDto, @CurrentUser() user: any) {
        return await this.useCase.create(data, user.id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENT', 'ADMIN', 'TALLER')
    async updateStatus(@Param('id') id: string, @Body() data: UpdateServiceRequestStatusDto, @CurrentUser() user: any) {
        return await this.useCase.updateStatus(id, data, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENT', 'ADMIN')
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
    async getPaginate(@Query() q: QueryOptions<any, ServiceRequestQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user);
    }
}
