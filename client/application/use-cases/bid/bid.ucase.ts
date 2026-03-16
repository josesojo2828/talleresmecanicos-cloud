import { Injectable, ForbiddenException, BadRequestException } from "@nestjs/common";
import BidModel from "../../../domain/models/bid.model";
import BidPersistence from "../../../infrastructure/persistence/bid/persistence";
import { CreateBidDto, UpdateBidStatusDto, BidQueryFilter } from "../../dtos/bid.dto";
import { QueryOptions } from "src/shared/query/input";

@Injectable()
export class BidUCase extends BidModel {
    constructor(private readonly persistence: BidPersistence) {
        super();
    }

    async create(data: CreateBidDto, workshopId: string) {
        return {
            message: 'success.create',
            data: await this.persistence.create({
                ...data,
                workshop: { connect: { id: workshopId } },
                request: { connect: { id: data.requestId } }
            })
        };
    }

    async updateStatus(id: string, data: UpdateBidStatusDto, user: any) {
        const entity = await this.findOne(id, user);
        
        // Only the client who owns the request can accept/reject a bid
        if (user.role === 'CLIENT') {
            if (entity.request.userId !== user.id) {
                throw new ForbiddenException("Only the owner of the request can accept/reject bids");
            }
        }

        return {
            message: 'success.update',
            data: await this.persistence.update(id, { status: data.status })
        };
    }

    async delete(id: string, user: any) {
        const entity = await this.findOne(id, user);
        // Only the workshop who made the bid can delete it (if still pending)
        if (user.role === 'TALLER' && entity.workshopId !== user.workshop?.id) {
             throw new ForbiddenException("No permission");
        }
        return {
            message: 'success.delete',
            data: await this.persistence.delete(id)
        };
    }

    async findOne(id: string, user: any) {
        const entity = await this.persistence.find({ id });
        if (!entity) throw new ForbiddenException("Bid not found");
        return entity;
    }

    async pagination(q: QueryOptions<any, BidQueryFilter>, user: any) {
        const { search, filters, skip, take, orderBy } = q as any;
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : (filters || {});
        
        const wh = this.getWhere(parsedFilters, search);

        return await this.persistence.getAll({
            where: wh,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy as any
        });
    }
}
