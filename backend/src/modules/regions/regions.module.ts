import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

// Controllers
import { CountryCrudController } from "./infrastructure/controllers/country.crud";
import { CityCrudController } from "./infrastructure/controllers/city.crud";

// Use Cases - Country
import CreateCountryUCase from "./application/use-cases/country/create.ucase";
import UpdateCountryUCase from "./application/use-cases/country/update.ucase";
import DeleteCountryUCase from "./application/use-cases/country/delete.ucase";
import QueryCountryUCase from "./application/use-cases/country/query.ucase";

// Use Cases - City
import CreateCityUCase from "./application/use-cases/city/create.ucase";
import UpdateCityUCase from "./application/use-cases/city/update.ucase";
import DeleteCityUCase from "./application/use-cases/city/delete.ucase";
import QueryCityUCase from "./application/use-cases/city/query.ucase";

// Persistence - Country
import CreateCountryPersistence from "./infrastructure/persistence/country/create.persistence";
import UpdateCountryPersistence from "./infrastructure/persistence/country/update.persistence";
import DeleteCountryPersistence from "./infrastructure/persistence/country/delete.persistence";
import FindCountryPersistence from "./infrastructure/persistence/country/find.persistence";

// Persistence - City
import CreateCityPersistence from "./infrastructure/persistence/city/create.persistence";
import UpdateCityPersistence from "./infrastructure/persistence/city/update.persistence";
import DeleteCityPersistence from "./infrastructure/persistence/city/delete.persistence";
import FindCityPersistence from "./infrastructure/persistence/city/find.persistence";

@Module({
    imports: [],
    controllers: [
        CountryCrudController,
        CityCrudController
    ],
    providers: [
        PrismaService,

        // Country
        CreateCountryUCase,
        UpdateCountryUCase,
        DeleteCountryUCase,
        QueryCountryUCase,
        CreateCountryPersistence,
        UpdateCountryPersistence,
        DeleteCountryPersistence,
        FindCountryPersistence,

        // City
        CreateCityUCase,
        UpdateCityUCase,
        DeleteCityUCase,
        QueryCityUCase,
        CreateCityPersistence,
        UpdateCityPersistence,
        DeleteCityPersistence,
        FindCityPersistence,
    ],
    exports: [
        FindCountryPersistence,
        FindCityPersistence,
    ]
})
export class RegionsModule { }
