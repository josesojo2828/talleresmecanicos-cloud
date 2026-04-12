import { Controller, Get, Query } from "@nestjs/common";
import QueryCountryUCase from "../../application/use-cases/country/query.ucase";
import QueryCityUCase from "../../application/use-cases/city/query.ucase";
import { QueryOptions } from "src/shared/query/input";
import { Country, City } from "@prisma/client";

@Controller('public/locations')
export class PublicRegionsController {
    constructor(
        private readonly queryCountryUseCase: QueryCountryUCase,
        private readonly queryCityUseCase: QueryCityUCase,
    ) { }

    @Get('countries')
    async getCountries(@Query() q: QueryOptions<Country, any>) {
        // Forzamos un take alto para traer todos los países por defecto
        return await this.queryCountryUseCase.pagination({ 
            q: { ...q, take: q.take || 100 }, 
            user: { role: 'PUBLIC' } 
        });
    }

    @Get('cities')
    async getCities(@Query() q: QueryOptions<City, any>) {
        return await this.queryCityUseCase.pagination({ 
            q: { ...q, take: q.take || 100 }, 
            user: { role: 'PUBLIC' } 
        });
    }
}
