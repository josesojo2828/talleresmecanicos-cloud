import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { StorageService } from "src/modules/storage/storage.service";
import { ForumUCase } from "../../application/use-cases/forum.ucase";
import { ICreateForumPostDto, IUpdateForumPostDto, ICreateForumCommentDto } from "../../application/dtos/forum.dto";
import { QueryOptions } from "src/shared/query/input";
import { ForumPost, ForumComment } from "@prisma/client";
import { IForumPostQueryFilter, IForumCommentQueryFilter } from "../../application/dtos/forum.schema";

@Controller('forum-post')
export class ForumCrudController {
    constructor(
        private readonly useCase: ForumUCase,
        private readonly storageService: StorageService
    ) {}

    // --- POSTS ---
    @Post('')
    async createPost(@Body() data: ICreateForumPostDto) {
        return await this.useCase.createPost(data);
    }

    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() data: IUpdateForumPostDto) {
        return await this.useCase.updatePost(id, data);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return await this.useCase.deletePost(id);
    }

    @Get('recommended')
    async getRecommended(@Query('take') take?: number, @Query('userId') userId?: string) {
        return await this.useCase.getRecommendedPosts(take ? Number(take) : 5, userId);
    }

    @Get(':id')
    async getPostById(@Param('id') id: string, @Query('userId') userId?: string) {
        return await this.useCase.findPost(id, userId);
    }

    @Get('')
    async getPosts(@Query() q: QueryOptions<ForumPost, IForumPostQueryFilter>, @Query('userId') userId?: string) {
        return await this.useCase.paginationPosts(q, userId);
    }

    @Post('upload-images')
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
        const results = await Promise.all(files.map(async file => {
            const key = await this.storageService.uploadFile(file, 'forum/images');
            const url = await this.storageService.getFileUrl(key);
            return { key, url };
        }));
        return results;
    }

    // --- ACTIONS ---
    @Post(':id/like')
    async toggleLike(@Param('id') postId: string, @Body('userId') userId: string) {
        return await this.useCase.toggleLike(userId, postId);
    }

    @Post(':id/favorite')
    async toggleFavorite(@Param('id') postId: string, @Body('userId') userId: string) {
        return await this.useCase.toggleFavorite(userId, postId);
    }

    // --- COMMENTS ---
    @Post('comment')
    async createComment(@Body() data: ICreateForumCommentDto) {
        return await this.useCase.createComment(data);
    }

    @Delete('comment/:id')
    async deleteComment(@Param('id') id: string) {
        return await this.useCase.deleteComment(id);
    }

    @Get('comment')
    async getComments(@Query() q: QueryOptions<ForumComment, IForumCommentQueryFilter>) {
        return await this.useCase.getComments(q);
    }

    @Get('stats')
    async getStats(@Query('userId') userId?: string) {
        return await this.useCase.getStats(userId);
    }
}
