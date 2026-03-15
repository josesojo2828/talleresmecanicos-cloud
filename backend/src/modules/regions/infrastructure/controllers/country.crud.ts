import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import CreateCountryUCase from "../../application/use-cases/country/create.ucase";
import UpdateCountryUCase from "../../application/use-cases/country/update.ucase";
import DeleteCountryUCase from "../../application/use-cases/country/delete.ucase";
import QueryCountryUCase from "../../application/use-cases/country/query.ucase";
import { ICreateCountryDto, IUpdateCountryDto } from "../../application/dtos/regions.dto";
import { QueryOptions } from "src/shared/query/input";
import { Country, UserRole } from "prisma/generated/client";
import { ICountryQueryFilter } from "../../application/dtos/regions.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";

@Controller('country')
export class CountryCrudController {
    constructor(
        private readonly createUseCase: CreateCountryUCase,
        private readonly updateUseCase: UpdateCountryUCase,
        private readonly deleteUseCase: DeleteCountryUCase,
        private readonly queryUseCase: QueryCountryUCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() data: ICreateCountryDto) {
        return await this.createUseCase.execute({ data });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() data: IUpdateCountryDto) {
        return await this.updateUseCase.execute({ data, id });
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string) {
        return await this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async getById(@Param('id') id: string) {
        return await this.queryUseCase.findOne({ id });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<Country, ICountryQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
