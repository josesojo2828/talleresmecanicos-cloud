import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ICountryCreateType } from "../../../application/dtos/regions.schema";

@Injectable()
export default class CreateCountryPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async save({ data }: { data: ICountryCreateType }) {
        return await this.prisma.country.create({ data })
    }
}
