import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import WorkPersistence from "./infrastructure/persistence/persistence";
import { WorkUCase } from "./application/use-cases/work.ucase";
import { WorkController } from "./infrastructure/controllers/work.controller";

@Module({
    controllers: [WorkController],
    providers: [
        PrismaService,
        WorkPersistence,
        WorkUCase,
    ],
    exports: [WorkUCase],
})
export class WorkModule {}
