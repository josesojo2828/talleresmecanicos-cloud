import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { PermissionCrudController } from "./infrastructure/controllers/permission.crud";
import { LoadUserService } from "./application/service/load.user";
import { LoadRegionsService } from "./application/service/load.regions";
import { LoadForumService } from "./application/service/load.forum";
import { LoadPublicationsService } from "./application/service/load.publications";
import { LoadInventoryService } from "./application/service/load.inventory";
import { MainSeedService } from "./application/service/main.seed";

@Module({
    imports: [],
    controllers: [PermissionCrudController],
    providers: [
        LoadUserService,
        LoadRegionsService,
        LoadForumService,
        LoadPublicationsService,
        LoadInventoryService,
        MainSeedService,

        PrismaService,
    ],
    exports: [
    ],
})
export default class SecurityModule { }

