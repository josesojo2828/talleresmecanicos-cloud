import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateDeviceUCase from "../../application/use-cases/device/create.ucase";
import UpdateDeviceUCase from "../../application/use-cases/device/update.ucase";
import DeleteDeviceUCase from "../../application/use-cases/device/delete.ucase";
import QueryDeviceUCase from "../../application/use-cases/device/query.ucase";
import { ICreateDeviceDto, IUpdateDeviceDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { Device } from "prisma/generated/client";
import { IDeviceQueryFilter } from "../../application/dtos/user.schema";

@Controller('device')
export class DeviceCrudController {
    constructor(
        private readonly createUseCase: CreateDeviceUCase,
        private readonly updateUseCase: UpdateDeviceUCase,
        private readonly deleteUseCase: DeleteDeviceUCase,
        private readonly queryUseCase: QueryDeviceUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateDeviceDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateDeviceDto) {
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
    async getPaginate(@Query() q: QueryOptions<Device, IDeviceQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
