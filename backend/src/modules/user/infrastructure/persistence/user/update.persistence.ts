import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IUserUpdateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class UpdateUserPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async update({ id, data }: { id: string, data: IUserUpdateType }) {
        return await this.prisma.user.update({
            where: { id },
            data
        });
    }
}
