import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

// Controllers
import { ForumCrudController } from "./infrastructure/controllers/forum.crud";

// Use Cases
import { ForumUCase } from "./application/use-cases/forum.ucase";

// Persistence
import ForumPostPersistence from "./infrastructure/persistence/post/persistence";
import ForumCommentPersistence from "./infrastructure/persistence/forum-comment/persistence";

@Module({
    imports: [],
    controllers: [
        ForumCrudController,
    ],
    providers: [
        PrismaService,
        ForumUCase,
        ForumPostPersistence,
        ForumCommentPersistence,
    ],
    exports: [
        ForumPostPersistence,
        ForumCommentPersistence,
    ]
})
export class ForumModule { }
