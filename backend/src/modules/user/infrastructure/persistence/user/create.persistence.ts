import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IUserCreateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class CreateUserPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async save({ data }: { data: IUserCreateType }) {
        return await this.prisma.user.create({ data });
    }
}
