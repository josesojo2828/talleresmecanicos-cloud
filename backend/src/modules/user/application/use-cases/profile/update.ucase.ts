import { BadRequestException, Injectable } from "@nestjs/common";
import ProfileModel from "src/modules/user/domain/models/profile.model";
import { UpdateProfilePersistence, FindProfilePersistence } from "src/modules/user/infrastructure/persistence/profile/profile.persistence";
import { IUpdateProfileDto } from "src/modules/user/application/dtos/user.dto";
import { IProfileUpdateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class UpdateProfileUCase extends ProfileModel {

    constructor(
        private readonly updatePersistence: UpdateProfilePersistence,
        private readonly findPersistence: FindProfilePersistence
    ) {
        super()
    }

    public async execute({ data, id }: { data: IUpdateProfileDto, id: string }) {
        const { avatarUrl } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const body: IProfileUpdateType = {};
        // if (birthDate) body.birthDate = birthDate;
        if (avatarUrl) body.avatarUrl = avatarUrl;

        const entityUpdated = await this.updatePersistence.update({ data: body, id });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
