import { BadRequestException, Injectable, ForbiddenException } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import CreateUserPersistence from "src/modules/user/infrastructure/persistence/user/create.persistence";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { ICreateUserDto } from "src/modules/user/application/dtos/user.dto";
import { PrismaService } from "src/config/prisma.service";
import * as bcrypt from 'bcrypt';
import { UserRole } from "@prisma/client";

@Injectable()
export default class CreateUserUCase extends UserModel {

    constructor(
        private readonly createPersistence: CreateUserPersistence,
        private readonly findPersistence: FindUserPersistence,
        private readonly prisma: PrismaService,
    ) {
        super()
    }

    public async execute({ data, currentUser }: { data: ICreateUserDto, currentUser?: any }) {
        // Bloqueo: Soporte NO puede crear ni Admins ni otros Soportes
        if (currentUser && currentUser.role === UserRole.SUPPORT) {
            if (data.role === UserRole.ADMIN || data.role === UserRole.SUPPORT) {
                throw new ForbiddenException('No tienes permisos para crear este tipo de usuario.');
            }
        }
        const { email, passwordHash, firstName, lastName, phone } = data;

        const existingUser = await this.findPersistence.findFirst({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(passwordHash, salt);

        const emailLower = data.email.toLowerCase();
        const isTaller = data.role === 'TALLER';

        // Si es TALLER y tiene país/ciudad, usamos transacción para crear User + Workshop atómicamente
        if (isTaller && data.countryId && data.cityId) {
            const result = await this.prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email: emailLower,
                        passwordHash: pass,
                        firstName,
                        lastName,
                        phone,
                        role: 'TALLER',
                        enabled: data.enabled ?? true,
                        country: { connect: { id: data.countryId } },
                        city: { connect: { id: data.cityId } },
                        profile: { create: {} },
                    }
                });

                // Auto-crear el Workshop vinculado al usuario
                await tx.workshop.create({
                    data: {
                        name: `Taller de ${firstName} ${lastName}`,
                        address: 'Dirección pendiente',
                        enabled: false, // Se habilita cuando complete su perfil
                        user: { connect: { id: newUser.id } },
                        country: { connect: { id: data.countryId } },
                        city: { connect: { id: data.cityId } },
                    }
                });

                return newUser;
            });

            return {
                message: 'success.create',
                data: result
            };
        }

        // Para otros roles (SUPPORT, CLIENT, etc.) solo creamos el usuario
        const entityCreated = await this.createPersistence.save({
            data: {
                email: emailLower,
                passwordHash: pass,
                firstName,
                lastName,
                phone,
                role: (data.role as any) || 'CLIENT',
                enabled: data.enabled ?? true,
                country: data.countryId ? { connect: { id: data.countryId } } : undefined,
                city: data.cityId ? { connect: { id: data.cityId } } : undefined,
                profile: { create: {} },
            }
        });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
