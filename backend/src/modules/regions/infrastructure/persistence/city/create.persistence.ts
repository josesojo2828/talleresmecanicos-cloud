import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ICityCreateType } from "../../../application/dtos/regions.schema";

@Injectable()
export default class CreateCityPersistence {

    constructor(
        public readonly prisma: PrismaService
    ) { }

    public async save({ data }: { data: ICityCreateType }) {
        return await this.prisma.city.create({ data })
    }
}
