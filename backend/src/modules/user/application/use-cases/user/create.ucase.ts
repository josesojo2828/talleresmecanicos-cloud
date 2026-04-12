import { BadRequestException, Injectable } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import CreateUserPersistence from "src/modules/user/infrastructure/persistence/user/create.persistence";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { ICreateUserDto } from "src/modules/user/application/dtos/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export default class CreateUserUCase extends UserModel {

    constructor(
        private readonly createPersistence: CreateUserPersistence,
        private readonly findPersistence: FindUserPersistence,
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateUserDto }) {
        const { email, passwordHash, firstName, lastName, phone } = data;

        const existingUser = await this.findPersistence.findFirst({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(passwordHash, salt);


        const emailLower = data.email.toLowerCase();
        // const referralCode = await this.generateReferralCode(data.firstName);

        const entityCreated = await this.createPersistence.save({
            data: {
                email: emailLower,
                passwordHash: pass,
                firstName,
                lastName,
                phone,
                role: (data.role as any) || 'CLIENT',
                enabled: data.enabled ?? true,
                profile: { create: {} },
            }
        });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }

    // private async generateReferralCode(firstName: string): Promise<string> {
    //     const base = firstName.substring(0, 3).toUpperCase().replace(/\s/g, 'X');

    //     while (true) {
    //         const random = Math.floor(1000 + Math.random() * 9000);
    //         const code = `${base}${random}`;
    //         const exists = await this.findPersistence.findFirst({ where: { referralCode: code } });
    //         if (!exists) return code;
    //     }
    // }
}
