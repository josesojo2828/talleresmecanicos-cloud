import { Controller, Get, Query } from "@nestjs/common";
import { WorkshopUCase } from "../../application/use-cases/workshop/workshop.ucase";
import { QueryOptions } from "src/shared/query/input";
import { Workshop } from "@prisma/client";
import { IWorkshopQueryFilter } from "../../application/dtos/workshop.schema";

@Controller('public')
export class PublicWorkshopController {
    constructor(private readonly useCase: WorkshopUCase) {}

    @Get('workshops')
    async getPublicWorkshops(@Query() q: QueryOptions<Workshop, IWorkshopQueryFilter>) {
        // Forzamos el rol PUBLIC para asegurar el filtro de enabled: true
        return await this.useCase.pagination(q, { role: 'PUBLIC' });
    }
}
