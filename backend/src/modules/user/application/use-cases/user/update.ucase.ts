import { BadRequestException, Injectable, ForbiddenException } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import UpdateUserPersistence from "src/modules/user/infrastructure/persistence/user/update.persistence";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { IUpdateUserDto } from "src/modules/user/application/dtos/user.dto";
import { IUserUpdateType } from "src/modules/user/application/dtos/user.schema";
import * as bcrypt from 'bcrypt';
import { UserRole } from "@prisma/client";

@Injectable()
export default class UpdateUserUCase extends UserModel {

    constructor(
        private readonly updatePersistence: UpdateUserPersistence,
        private readonly findPersistence: FindUserPersistence
    ) {
        super()
    }

    public async execute({ data, id, currentUser }: { data: IUpdateUserDto, id: string, currentUser?: any }) {
        const { email, firstName, lastName, phone, passwordHash } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        // Bloqueo: Soporte NO puede editar Admins ni otros Soportes
        // Tampoco puede promover a nadie a Admin o Soporte
        if (currentUser && currentUser.role === UserRole.SUPPORT) {
            if (entity.role === UserRole.ADMIN || entity.role === UserRole.SUPPORT) {
                throw new ForbiddenException('No tienes permisos para editar este tipo de usuario.');
            }
            if (data.role === UserRole.ADMIN || data.role === UserRole.SUPPORT) {
                throw new ForbiddenException('No puedes promover usuarios a este rol.');
            }
        }

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
