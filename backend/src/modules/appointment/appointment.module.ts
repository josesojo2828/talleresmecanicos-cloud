import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import AppointmentPersistence from "./infrastructure/persistence/persistence";
import { AppointmentUCase } from "./application/use-cases/appointment.ucase";
import { AppointmentController } from "./infrastructure/controllers/appointment.controller";

@Module({
    controllers: [AppointmentController],
    providers: [
        PrismaService,
        AppointmentPersistence,
        AppointmentUCase,
    ],
    exports: [AppointmentUCase],
})
export class AppointmentModule {}
