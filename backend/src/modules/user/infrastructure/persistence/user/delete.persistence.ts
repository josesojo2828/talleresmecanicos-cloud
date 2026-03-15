import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class DeleteUserPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async delete({ id }: { id: string }) {
        // Soft delete
        return await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    public async hardDelete({ id }: { id: string }) {
        return await this.prisma.user.delete({
            where: { id }
        });
    }
}
