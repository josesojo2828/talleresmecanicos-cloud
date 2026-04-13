import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

// Controllers
import { WorkshopCrudController } from "./infrastructure/controllers/workshop.crud";
import { MyWorkshopController } from "./infrastructure/controllers/my-workshop.controller";
import { WorkshopCategoryCrudController } from "./infrastructure/controllers/workshop-category.crud";
import { PublicationCrudController } from "./infrastructure/controllers/publication.crud";
import { FinanceController } from "./infrastructure/controllers/finance.controller";
import { PublicWorkshopController } from "./infrastructure/controllers/public-workshop.controller";
import { WorkshopClientController } from "./infrastructure/controllers/workshop-client.controller";

// Use Cases
import { WorkshopUCase } from "./application/use-cases/workshop/workshop.ucase";
import { WorkshopCategoryUCase } from "./application/use-cases/workshop-category/workshop-category.ucase";
import { PublicationUCase } from "./application/use-cases/publication/publication.ucase";
import { FinanceUCase } from "./application/use-cases/finance/finance.ucase";
import { WorkshopClientUCase } from "./application/use-cases/workshop-client.ucase";

// Persistence
import WorkshopPersistence from "./infrastructure/persistence/workshop/persistence";
import WorkshopCategoryPersistence from "./infrastructure/persistence/workshop-category/persistence";
import PublicationPersistence from "./infrastructure/persistence/publication/persistence";
import WorkshopClientPersistence from "./infrastructure/persistence/workshop-client.persistence";

@Module({
    imports: [],
    controllers: [
        WorkshopCrudController,
        MyWorkshopController,
        WorkshopCategoryCrudController,
        PublicationCrudController,
        FinanceController,
        PublicWorkshopController,
        WorkshopClientController,
    ],
    providers: [
        PrismaService,

        // Workshop
        WorkshopUCase,
        WorkshopPersistence,

        // Category
        WorkshopCategoryUCase,
        WorkshopCategoryPersistence,

        // Publication
        PublicationUCase,
        PublicationPersistence,
        FinanceUCase,

        // Workshop Client
        WorkshopClientUCase,
        WorkshopClientPersistence,
    ],
    exports: [
        WorkshopPersistence,
        WorkshopCategoryPersistence,
        PublicationPersistence,
    ]
})
export class WorkshopModule { }
