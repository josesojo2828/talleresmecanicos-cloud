import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Query,
    UseGuards,
    UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder = 'general') {
        const key = await this.storageService.uploadFile(file, folder);
        const url = await this.storageService.getFileUrl(key);
        return { key, url };
    }

    @Post('upload-multiple')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Query('folder') folder = 'general') {
        const results = await Promise.all(
            files.map(async (file) => {
                const key = await this.storageService.uploadFile(file, folder);
                const url = await this.storageService.getFileUrl(key);
                return { key, url };
            }),
        );
        return results;
    }

    @Get('url')
    async getUrl(@Query('key') key: string) {
        const url = await this.storageService.getFileUrl(key);
        return { url };
    }
}
