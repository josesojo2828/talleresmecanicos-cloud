import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IAppointmentCreateType, IAppointmentUpdateType, IAppointmentWhereUniqueType, IAppointmentWhereType, IAppointmentOrderByType, IAppointmentIncludeType, IDefaultAppointmentInclude } from "../../application/dtos/appointment.schema";

@Injectable()
export default class AppointmentPersistence {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: IAppointmentCreateType) {
        return await this.prisma.appointment.create({ data });
    }

    async update(id: string, data: IAppointmentUpdateType) {
        return await this.prisma.appointment.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await this.prisma.appointment.delete({ where: { id } });
    }

    async find(where: IAppointmentWhereUniqueType, include?: IAppointmentIncludeType) {
        return await this.prisma.appointment.findUnique({ where, include: include || IDefaultAppointmentInclude });
    }

    async getAll({ where, orderBy, skip, take, include }: { where?: IAppointmentWhereType, orderBy?: IAppointmentOrderByType, skip?: number, take?: number, include?: IAppointmentIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.appointment.count({ where }),
            this.prisma.appointment.findMany({ where, orderBy, take, skip, include: include || IDefaultAppointmentInclude })
        ]);
        return { total, data };
    }
}
