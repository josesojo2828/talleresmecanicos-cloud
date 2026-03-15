import { Module } from "@nestjs/common";
import AppicationController from "./infrastructure/controller/app.controller";
import { RegionsModule } from "../regions/regions.module";
import SecurityModule from "../security/security.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        RegionsModule,
        SecurityModule,
        UserModule,
    ],
    controllers: [AppicationController],
    providers: [],
    exports: [],
})
export default class AppicationModule { }
