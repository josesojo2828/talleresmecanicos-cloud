import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateSessionUCase from "../../application/use-cases/session/create.ucase";
import UpdateSessionUCase from "../../application/use-cases/session/update.ucase";
import DeleteSessionUCase from "../../application/use-cases/session/delete.ucase";
import QuerySessionUCase from "../../application/use-cases/session/query.ucase";
import { ICreateSessionDto, IUpdateSessionDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { Session } from "prisma/generated/client";
import { ISessionQueryFilter } from "../../application/dtos/user.schema";

@Controller('session')
export class SessionCrudController {
    constructor(
        private readonly createUseCase: CreateSessionUCase,
        private readonly updateUseCase: UpdateSessionUCase,
        private readonly deleteUseCase: DeleteSessionUCase,
        private readonly queryUseCase: QuerySessionUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateSessionDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateSessionDto) {
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
    async getPaginate(@Query() q: QueryOptions<Session, ISessionQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
