import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

// TODO: Move to config
const jwtConstants = {
    secret: process.env.JWT_SECRET || 'secretKey', // Fallback for dev only
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true, // Allow access to request to check token
        });
    }

    async validate(req: any, payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                supportAssignments: true
            }
        });

        if (!user || user.deletedAt || !user.enabled) {
            throw new UnauthorizedException('Sesión inválida o expirada o cuenta inhabilitada');
        }

        return { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            assignments: user.supportAssignments 
        };
    }
}
