import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import CreateCityUCase from "../../application/use-cases/city/create.ucase";
import UpdateCityUCase from "../../application/use-cases/city/update.ucase";
import DeleteCityUCase from "../../application/use-cases/city/delete.ucase";
import QueryCityUCase from "../../application/use-cases/city/query.ucase";
import { ICreateCityDto, IUpdateCityDto } from "../../application/dtos/regions.dto";
import { QueryOptions } from "src/shared/query/input";
import { City, UserRole } from "@prisma/client";
import { ICityQueryFilter } from "../../application/dtos/regions.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('city')
export class CityCrudController {
    constructor(
        private readonly createUseCase: CreateCityUCase,
        private readonly updateUseCase: UpdateCityUCase,
        private readonly deleteUseCase: DeleteCityUCase,
        private readonly queryUseCase: QueryCityUCase,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async create(@Body() data: ICreateCityDto, @CurrentUser() user: any) {
        return await this.createUseCase.execute({ data, user });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async update(@Param('id') id: string, @Body() data: IUpdateCityDto, @CurrentUser() user: any) {
        return await this.updateUseCase.execute({ data, id, user });
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.deleteUseCase.execute({ id, user });
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.queryUseCase.findOne({ id, user: user || { role: 'PUBLIC' } });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<City, ICityQueryFilter>, @CurrentUser() user: any) {
        return await this.queryUseCase.pagination({ q, user: user || { role: 'PUBLIC' } });
    }
}
