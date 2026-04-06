import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../config/prisma.service';
import DashboardService from '../user/application/service/dashboard.service';

import { OptionalAuthGuard } from './guards/optional-auth.guard';

const jwtConstants = {
    secret: process.env.JWT_SECRET || 'secretKey', // Fallback for dev only
};

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60d' }, // User requested stored token, giving long expiry or as needed
        }),
    ],
    providers: [AuthService, JwtStrategy, OptionalAuthGuard, PrismaService, DashboardService],
    controllers: [AuthController],
    exports: [AuthService, OptionalAuthGuard],
})
export class AuthModule { }
