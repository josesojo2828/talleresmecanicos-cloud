import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ICityUpdateType } from "../../../application/dtos/regions.schema";

@Injectable()
export default class UpdateCityPersistence {

    constructor(
        public readonly prisma: PrismaService
    ) { }

    public async update({ id, data }: { id: string, data: ICityUpdateType }) {
        return await this.prisma.city.update({
            where: { id },
            data
        })
    }
}
