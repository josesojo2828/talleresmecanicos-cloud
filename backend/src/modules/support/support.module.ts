import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

// Controllers
import { SupportCrudController } from "./infrastructure/controllers/support.crud";

// Use Cases
import { SupportUCase } from "./application/use-cases/support.ucase";

// Persistence
import SupportAssignmentPersistence from "./infrastructure/persistence/assignment/persistence";

@Module({
    imports: [],
    controllers: [
        SupportCrudController,
    ],
    providers: [
        PrismaService,
        SupportUCase,
        SupportAssignmentPersistence,
    ],
    exports: [
        SupportAssignmentPersistence,
    ]
})
export class SupportModule { }
