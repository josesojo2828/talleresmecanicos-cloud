import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { VehicleUCase } from "../../../application/use-cases/vehicle/vehicle.ucase";
import { CreateVehicleDto, UpdateVehicleDto, VehicleQueryFilter } from "../../../application/dtos/vehicle.dto";
import { QueryOptions } from "src/shared/query/input";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('vehicle')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
    constructor(private readonly useCase: VehicleUCase) {}

    @Post()
    @Roles('CLIENT')
    async create(@Body() data: CreateVehicleDto, @CurrentUser() user: any) {
        return await this.useCase.create(data, user.id);
    }

    @Put(':id')
    @Roles('CLIENT', 'ADMIN')
    async update(@Param('id') id: string, @Body() data: UpdateVehicleDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @Roles('CLIENT', 'ADMIN')
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    @Roles('CLIENT', 'ADMIN')
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    @Get('')
    @Roles('CLIENT', 'ADMIN')
    async getPaginate(@Query() q: QueryOptions<any, VehicleQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user);
    }
}
