import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [ChatGateway, ChatService, PrismaService],
})
export class ChatModule {}
