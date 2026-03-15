import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PublicationUCase } from "../../application/use-cases/publication/publication.ucase";
import { ICreatePublicationDto, IUpdatePublicationDto } from "../../application/dtos/workshop.dto";
import { QueryOptions } from "src/shared/query/input";
import { Publication, UserRole } from "prisma/generated/client";
import { IPublicationQueryFilter } from "../../application/dtos/workshop.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('publication')
export class PublicationCrudController {
    constructor(private readonly useCase: PublicationUCase) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.TALLER)
    async create(@Body() data: ICreatePublicationDto, @CurrentUser() user: any) {
        return await this.useCase.create(data, user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.TALLER)
    async update(@Param('id') id: string, @Body() data: IUpdatePublicationDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.TALLER)
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user || { role: 'PUBLIC' });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<Publication, IPublicationQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user || { role: 'PUBLIC' });
    }
}
