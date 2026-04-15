import { BadRequestException, Injectable } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import UpdateUserPersistence from "src/modules/user/infrastructure/persistence/user/update.persistence";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { IUpdateUserDto } from "src/modules/user/application/dtos/user.dto";
import { IUserUpdateType } from "src/modules/user/application/dtos/user.schema";
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UpdateUserUCase extends UserModel {

    constructor(
        private readonly updatePersistence: UpdateUserPersistence,
        private readonly findPersistence: FindUserPersistence
    ) {
        super()
    }

    public async execute({ data, id }: { data: IUpdateUserDto, id: string }) {
        const { email, firstName, lastName, phone, passwordHash } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const body: IUserUpdateType = {};

        if (email) body.email = email;
        if (firstName) body.firstName = firstName;
        if (lastName) body.lastName = lastName;
        if (phone) body.phone = phone;
        if (data.role) (body as any).role = data.role;
        if (data.enabled !== undefined) body.enabled = data.enabled;
        if (data.countryId) body.country = { connect: { id: data.countryId } };
        if (data.cityId) body.city = { connect: { id: data.cityId } };
        // if (status) body.status = status;
        // if (kycLevel) body.kycLevel = kycLevel;

        if (passwordHash) {
            const salt = await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(passwordHash, salt);
            body.passwordHash = pass;
        }

        const entityUpdated = await this.updatePersistence.update({ data: body, id });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
