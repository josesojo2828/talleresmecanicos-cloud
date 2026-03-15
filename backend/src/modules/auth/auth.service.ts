import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    NotFoundException
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

        const user = await this.prisma.user.create({
            data: {
                email: emailLower,
                passwordHash,
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                role: 'CLIENT', // Role por defecto
                enabled: true
            },
        });

        return {
            message: 'Usuario registrado exitosamente',
            userId: user.id
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