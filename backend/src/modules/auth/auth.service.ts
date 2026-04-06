import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    NotFoundException,
    Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IDefaultUserInclude } from '../user/application/dtos/user.schema';
import DashboardService from '../user/application/service/dashboard.service';
import { IUser } from 'src/types/user/user';
import FindUserPersistence from '../user/infrastructure/persistence/user/find.persistence';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private dashboardService: DashboardService,
        private findUserPersistence: FindUserPersistence,
    ) { }

    async validateUser(email: string, pass: string): Promise<IUser> {
        const user: any = await this.findUserPersistence.find({
            where: { email },
            include: IDefaultUserInclude
        });

        if (!user) {
            return null;
        }

        const found = await bcrypt.compare(pass, user.passwordHash);

        if (!found) {
            return null;
        }

        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }
        const dashboardPromise = this.dashboardService.getPages(user);

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };

        const token = this.jwtService.sign(payload);

        await this.prisma.auditLog.create({
            data: {
                action: 'LOGIN',
                userId: user.id,
                details: {
                    ip: 'IP_TRACKING_PENDING'
                },
            },
        });

        const dashboard = await dashboardPromise;

        console.log(`[NEW SESSION]: ${user.email} - ${token} - ${new Date().toISOString()}`)

        return {
            access_token: token,
            user,
            message: 't.success.login',
            dashboard
        };
    }

    async register(registerDto: RegisterDto) {
        const emailLower = registerDto.email.toLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: { email: emailLower },
        });

        if (existingUser) {
            throw new BadRequestException('El correo electrónico ya está registrado');
        }

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(registerDto.password, salt);

        let userId = '';

        console.log(registerDto);
        console.log(emailLower);

        // Automatización: Si es un taller, crear el taller con los datos enviados
        if (registerDto.role === 'TALLER') {
            const workshopName = registerDto.workshopName || `Taller de ${registerDto.firstName}`;
            const address = registerDto.workshopAddress || '';
            const slug = (registerDto.workshopName || (registerDto.firstName + ' ' + registerDto.lastName))
                .toLowerCase()
                .trim()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
                .replace(/[^a-z0-9 ]/g, '') // Eliminar caracteres especiales
                .replace(/ /g, '-') // Cambiar espacios por guiones
                + '-' + Math.random().toString(36).substring(2, 6);
            
            this.logger.log(`Intentando registrar TALLER: ${emailLower} | Workshop: ${workshopName}`);
            this.logger.debug(`Registro DTO: ${JSON.stringify(registerDto)}`);

            try {
                const user = await this.prisma.user.create({
                    data: {
                        email: emailLower,
                        passwordHash,
                        firstName: registerDto.firstName,
                        lastName: registerDto.lastName,
                        role: registerDto.role as any,
                        enabled: true,
                        workshop: {
                            create: {
                                name: workshopName,
                                slug,
                                images: [],
                                address: address,
                                country: { connect: { id: registerDto.country } },
                                city: { connect: { id: registerDto.city } },
                                enabled: true,
                                openingHours: 'Lun-Sáb 8:00 - 18:00',
                                socialMedia: {},
                            }
                        }
                    },
                });

                userId = user.id;
                this.logger.log(`TALLER registrado con éxito: ${user.id}`);
            } catch (error) {
                this.logger.error(`Error fatal al registrar TALLER: ${error.message}`, error.stack);
                throw new BadRequestException('Error al crear el taller. Verifique que el país y la ciudad sean válidos.');
            }
        } else {

            const user = await this.prisma.user.create({
                data: {
                    email: emailLower,
                    passwordHash,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    role: registerDto.role as any,
                    enabled: true,
                },
            });

            userId = user.id;
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: IDefaultUserInclude
        });

        const dashboardPromise = this.dashboardService.getPages(user as any);

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };

        const token = this.jwtService.sign(payload);
        const dashboard = await dashboardPromise;

        return {
            message: 't.success.register',
            token: token,
            user: user,
            dashboard: dashboard
        };
    }

    async check(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: IDefaultUserInclude
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const { passwordHash, ...result } = user;
        return result;
    }
}