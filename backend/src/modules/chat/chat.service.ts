import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(userId: string, content: string) {
    return this.prisma.chatMessage.create({
      data: {
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async getMessages(limit: number = 50) {
    return this.prisma.chatMessage.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }
}
