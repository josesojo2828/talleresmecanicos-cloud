import { BadRequestException, Injectable } from "@nestjs/common";
import ProfileModel from "src/modules/user/domain/models/profile.model";
import { DeleteProfilePersistence, FindProfilePersistence } from "src/modules/user/infrastructure/persistence/profile/profile.persistence";

@Injectable()
export default class DeleteProfileUCase extends ProfileModel {

    constructor(
        private readonly deletePersistence: DeleteProfilePersistence,
        private readonly findPersistence: FindProfilePersistence
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
