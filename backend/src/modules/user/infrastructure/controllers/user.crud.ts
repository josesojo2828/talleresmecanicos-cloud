import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import CreateUserUCase from "../../application/use-cases/user/create.ucase";
import UpdateUserUCase from "../../application/use-cases/user/update.ucase";
import DeleteUserUCase from "../../application/use-cases/user/delete.ucase";
import QueryUserUCase from "../../application/use-cases/user/query.ucase";
import { ICreateUserDto, IUpdateUserDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { User, UserRole } from "@prisma/client";
import { IUserQueryFilter } from "../../application/dtos/user.schema";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserCrudController {
    constructor(
        private readonly createUseCase: CreateUserUCase,
        private readonly updateUseCase: UpdateUserUCase,
        private readonly deleteUseCase: DeleteUserUCase,
        private readonly queryUseCase: QueryUserUCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() body: ICreateUserDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    async update(@Param('id') id: string, @Body() body: IUpdateUserDto) {
        return await this.updateUseCase.execute({ data: body, id });
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string) {
        return await this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    async getById(@Param('id') id: string) {
        return await this.queryUseCase.findOne({ id });
    }

    @Get('')
    @Roles(UserRole.ADMIN)
    async getPaginate(@Query() q: QueryOptions<User, IUserQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
