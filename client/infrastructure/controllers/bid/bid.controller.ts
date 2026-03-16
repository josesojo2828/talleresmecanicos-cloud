import { Body, Controller, Delete, Get, Param, Post, Patch, Query, UseGuards } from "@nestjs/common";
import { BidUCase } from "../../../application/use-cases/bid/bid.ucase";
import { CreateBidDto, UpdateBidStatusDto, BidQueryFilter } from "../../../application/dtos/bid.dto";
import { QueryOptions } from "src/shared/query/input";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";

@Controller('bid')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BidController {
    constructor(private readonly useCase: BidUCase) {}

    @Post()
    @Roles('TALLER')
    async create(@Body() data: CreateBidDto, @CurrentUser() user: any) {
        // Find workshopId from current user
        const workshopId = user.workshop?.id;
        if (!workshopId) throw new Error("User must be a workshop owner");
        return await this.useCase.create(data, workshopId);
    }

    @Patch(':id/status')
    @Roles('CLIENT', 'ADMIN')
    async updateStatus(@Param('id') id: string, @Body() data: UpdateBidStatusDto, @CurrentUser() user: any) {
        return await this.useCase.updateStatus(id, data, user);
    }

    @Delete(':id')
    @Roles('TALLER', 'ADMIN')
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.delete(id, user);
    }

    @Get(':id')
    async getById(@Param('id') id: string, @CurrentUser() user: any) {
        return await this.useCase.findOne(id, user);
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<any, BidQueryFilter>, @CurrentUser() user: any) {
        return await this.useCase.pagination(q, user);
    }
}
