import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage-test')
export class StorageTestController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const key = await this.storageService.uploadFile(file, 'test');
        return {
            message: 'File uploaded successfully',
            key,
        };
    }

    @Get('url')
    async getUrl(@Query('key') key: string) {
        const url = await this.storageService.getFileUrl(key);
        return { url };
    }
}
