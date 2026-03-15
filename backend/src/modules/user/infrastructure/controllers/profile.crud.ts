import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateProfileUCase from "../../application/use-cases/profile/create.ucase";
import UpdateProfileUCase from "../../application/use-cases/profile/update.ucase";
import DeleteProfileUCase from "../../application/use-cases/profile/delete.ucase";
import QueryProfileUCase from "../../application/use-cases/profile/query.ucase";
import { ICreateProfileDto, IUpdateProfileDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { Profile } from "@prisma/client";
import { IProfileQueryFilter } from "../../application/dtos/user.schema";

@Controller('profile')
export class ProfileCrudController {
    constructor(
        private readonly createUseCase: CreateProfileUCase,
        private readonly updateUseCase: UpdateProfileUCase,
        private readonly deleteUseCase: DeleteProfileUCase,
        private readonly queryUseCase: QueryProfileUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateProfileDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateProfileDto) {
        return await this.updateUseCase.execute({ data: body, id });
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.queryUseCase.findOne({ id });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<Profile, IProfileQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
