import { Injectable } from "@nestjs/common";
import CountryModel from "../../../domain/models/country.model";
import FindCountryPersistence from "../../../infrastructure/persistence/country/find.persistence";
import { ICountryQueryFilter } from "../../dtos/regions.schema";
import { QueryOptions } from "src/shared/query/input";
import { Country } from "prisma/generated/client";

@Injectable()
export default class QueryCountryUCase extends CountryModel {

    constructor(
        private readonly findPersistence: FindCountryPersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Country, ICountryQueryFilter> }) {
        const { search, filters, skip, take, orderBy } = q as any;

        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
        const where = this.getWhere(parsedFilters || {}, search);

        const entity = await this.findPersistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined
        });

        return entity;
    }
}
