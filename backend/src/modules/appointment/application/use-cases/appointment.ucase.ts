import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import AppointmentModel from "../../domain/models/appointment.model";
import AppointmentPersistence from "../../infrastructure/persistence/persistence";
import { ICreateAppointmentDto, IUpdateAppointmentDto } from "../dtos/appointment.dto";
import { QueryOptions } from "src/shared/query/input";
import { Appointment, UserRole } from "@prisma/client";
import { IAppointmentQueryFilter } from "../dtos/appointment.schema";
import { getScopeFilter } from "src/shared/utils/scope-filter";

@Injectable()
export class AppointmentUCase extends AppointmentModel {
    constructor(private readonly persistence: AppointmentPersistence) {
        super();
    }

    async create(data: ICreateAppointmentDto) {
        const { workshopId, clientId, dateTime, description } = data;

        const body: any = {
            description,
            dateTime: new Date(dateTime),
            workshop: { connect: { id: workshopId } },
            client: { connect: { id: clientId } },
        };

        return {
            message: 'success.create',
            data: await this.persistence.create(body)
        };
    }

    async update(id: string, data: IUpdateAppointmentDto, user: any) {
        const appointment = await this.findOne(id, user);
        
        const { dateTime, description, status } = data;
        const body: any = {};
        
        if (dateTime) body.dateTime = new Date(dateTime);
        if (description !== undefined) body.description = description;
        if (status) body.status = status;

        return {
            message: 'success.update',
            data: await this.persistence.update(id, body)
        };
    }

    async delete(id: string, user: any) {
        await this.findOne(id, user); // Permissions check
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any) {
        const entity = await this.persistence.find({ id });
        if (!entity) throw new NotFoundException("La cita no existe");

        // Permission check: Admin/Support can see all. Workshop can see theirs. Client can see theirs.
        if (user.role === UserRole.ADMIN || user.role === UserRole.SUPPORT) return entity;
        
        if (user.role === UserRole.TALLER && entity.workshopId !== user.workshop?.id) {
            throw new ForbiddenException("No tienes permiso sobre esta cita");
        }
        
        if (user.role === UserRole.CLIENT && entity.clientId !== user.id) {
            throw new ForbiddenException("No tienes permiso sobre esta cita");
        }

        return entity;
    }

    async pagination(q: QueryOptions<Appointment, IAppointmentQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});
        
        // Apply scope filters
        if (user.role === UserRole.TALLER) {
            if (!user.workshop?.id) {
                throw new ForbiddenException("Debes configurar primero tu perfil de taller");
            }
            parsedFilters.workshopId = user.workshop.id;
        } else if (user.role === UserRole.CLIENT) {
            parsedFilters.clientId = user.id;
        }

        const where = this.getWhere(parsedFilters, search);

        return await this.persistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
}
