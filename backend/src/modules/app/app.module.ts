import { Module } from "@nestjs/common";
import AppicationController from "./infrastructure/controller/app.controller";
import { RegionsModule } from "../regions/regions.module";
import SecurityModule from "../security/security.module";
import { UserModule } from "../user/user.module";
import { PartModule } from "../part/part.module";
import { WorkshopModule } from "../workshop/workshop.module";

@Module({
    imports: [
        RegionsModule,
        SecurityModule,
        UserModule,
        PartModule,
        WorkshopModule,
    ],
    controllers: [AppicationController],
    providers: [],
    exports: [],
})
export default class AppicationModule { }
