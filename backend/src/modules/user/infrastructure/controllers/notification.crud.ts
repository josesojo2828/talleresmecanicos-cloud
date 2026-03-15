import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateNotificationUCase from "../../application/use-cases/notification/create.ucase";
import UpdateNotificationUCase from "../../application/use-cases/notification/update.ucase";
import DeleteNotificationUCase from "../../application/use-cases/notification/delete.ucase";
import QueryNotificationUCase from "../../application/use-cases/notification/query.ucase";
import { ICreateNotificationDto, IUpdateNotificationDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { Notification } from "prisma/generated/client";
import { INotificationQueryFilter } from "../../application/dtos/user.schema";

@Controller('notification')
export class NotificationCrudController {
    constructor(
        private readonly createUseCase: CreateNotificationUCase,
        private readonly updateUseCase: UpdateNotificationUCase,
        private readonly deleteUseCase: DeleteNotificationUCase,
        private readonly queryUseCase: QueryNotificationUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateNotificationDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateNotificationDto) {
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
    async getPaginate(@Query() q: QueryOptions<Notification, INotificationQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
