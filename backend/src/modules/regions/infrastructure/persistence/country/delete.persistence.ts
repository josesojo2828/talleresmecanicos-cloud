import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class DeleteCountryPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async delete({ id }: { id: string }) {
        return await this.prisma.country.delete({
            where: { id }
        })
    }
}
