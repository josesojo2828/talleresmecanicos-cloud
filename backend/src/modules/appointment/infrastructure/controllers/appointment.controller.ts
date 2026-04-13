import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AppointmentUCase } from "../../application/use-cases/appointment.ucase";
import { ICreateAppointmentDto, IUpdateAppointmentDto } from "../../application/dtos/appointment.dto";
import { QueryOptions } from "src/shared/query/input";
import { Appointment, UserRole } from "@prisma/client";
import { IAppointmentQueryFilter } from "../../application/dtos/appointment.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
    constructor(private readonly useCase: AppointmentUCase) {}

    @Post()
    @Roles(UserRole.ADMIN, UserRole.CLIENT, UserRole.TALLER)
    async create(@Body() data: ICreateAppointmentDto, @CurrentUser() user: any) {
        // Por defecto, el cliente es quien hace la solicitud
        if (!data.clientId) {
            data.clientId = user.id;
        }

        // Si es un CLIENTE, forzamos que sea él mismo
        if (user.role === UserRole.CLIENT) {
            data.clientId = user.id;
        }
        
        // Si es un TALLER y no especificó taller destino, usamos el de los parámetros o el suyo?
        // En el directorio el workshopId viene en el body desde la App.
        
        return await this.useCase.create(data);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.TALLER, UserRole.CLIENT)
    async update(@Param('id') id: string, @Body() data: IUpdateAppointmentDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.CLIENT)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<Appointment, IAppointmentQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user);
    }
}
