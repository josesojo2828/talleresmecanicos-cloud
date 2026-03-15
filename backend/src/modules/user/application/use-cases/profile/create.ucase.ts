import { Injectable } from "@nestjs/common";
import ProfileModel from "src/modules/user/domain/models/profile.model";
import { CreateProfilePersistence } from "src/modules/user/infrastructure/persistence/profile/profile.persistence";
import { ICreateProfileDto } from "src/modules/user/application/dtos/user.dto";
import { IProfileCreateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class CreateProfileUCase extends ProfileModel {

    constructor(
        private readonly createPersistence: CreateProfilePersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateProfileDto }) {
        const { avatarUrl, userId } = data;

        const body: IProfileCreateType = {
            avatarUrl,
            user: { connect: { id: userId } }
        }

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
