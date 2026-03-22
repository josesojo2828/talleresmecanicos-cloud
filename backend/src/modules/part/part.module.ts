import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { PartController } from "./infrastructure/controllers/part.controller";
import { PartUCase } from "./application/use-cases/part.ucase";
import PartPersistence from "./infrastructure/persistence/persistence";

@Module({
    controllers: [PartController],
    providers: [
        PrismaService, 
        PartUCase, 
        PartPersistence
    ],
    exports: [PartUCase, PartPersistence]
})
export class PartModule {}
