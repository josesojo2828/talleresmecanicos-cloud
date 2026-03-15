import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { ICountryUpdateType } from "../../../application/dtos/regions.schema";

@Injectable()
export default class UpdateCountryPersistence {

    constructor(
        public readonly prisma: PrismaService
    ) { }

    public async update({ id, data }: { id: string, data: ICountryUpdateType }) {
        return await this.prisma.country.update({
            where: { id },
            data
        })
    }
}
