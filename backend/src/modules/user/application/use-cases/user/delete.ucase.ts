import { BadRequestException, Injectable } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import DeleteUserPersistence from "src/modules/user/infrastructure/persistence/user/delete.persistence";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";

@Injectable()
export default class DeleteUserUCase extends UserModel {

    constructor(
        private readonly deletePersistence: DeleteUserPersistence,
        private readonly findPersistence: FindUserPersistence
    ) {
        super()
    }

    public async execute({ id }: { id: string }) {
        const entity = await this.findPersistence.find({ where: { id } });

        if (!entity) throw new BadRequestException('not_found');

        const entityDeleted = await this.deletePersistence.delete({ id });

        return {
            message: 'success.delete',
            data: entityDeleted
        };
    }
}
