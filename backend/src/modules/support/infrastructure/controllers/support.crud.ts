import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { SupportUCase } from "../../application/use-cases/support.ucase";
import { ICreateSupportAssignmentDto } from "../../application/dtos/support.dto";
import { QueryOptions } from "src/shared/query/input";
import { SupportAssignment } from "prisma/generated/client";
import { ISupportAssignmentQueryFilter } from "../../application/dtos/support.schema";

@Controller('support')
export class SupportCrudController {
    constructor(private readonly useCase: SupportUCase) {}

    @Post('assignment')
    async create(@Body() data: ICreateSupportAssignmentDto) {
        return await this.useCase.create(data);
    }

    @Delete('assignment/:id')
    async delete(@Param('id') id: string) {
        return await this.useCase.delete(id);
    }

    @Get('assignment')
    async getPaginate(@Query() q: QueryOptions<SupportAssignment, ISupportAssignmentQueryFilter>) {
        return await this.useCase.pagination(q);
    }
}
