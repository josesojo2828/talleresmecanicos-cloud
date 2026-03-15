import { Controller, Get, UseGuards, Put, Body, Param, Post, UseInterceptors, UploadedFile, UploadedFiles } from "@nestjs/common";
import { WorkshopUCase } from "../../application/use-cases/workshop/workshop.ucase";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { IUpdateWorkshopDto } from "../../application/dtos/workshop.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { StorageService } from "src/modules/storage/storage.service";

@Controller('my-workshop')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TALLER)
export class MyWorkshopController {
    constructor(
        private readonly useCase: WorkshopUCase,
        private readonly storageService: StorageService
    ) {}

    @Get()
    async getMine(@CurrentUser() user: any) {
        const result = await this.useCase.pagination({ skip: 0, take: 1, filters: { userId: user.id } }, user);
        
        // Resolve URLs but keep original keys
        const data = result.data;
        if (data && data.length > 0) {
            const workshop = data[0];
            // Add custom properties for frontend reference
            (workshop as any).logoKey = workshop.logoUrl;
            (workshop as any).imageKeys = workshop.images;

            if (workshop.logoUrl) {
                workshop.logoUrl = await this.storageService.getFileUrl(workshop.logoUrl);
            }
            if (workshop.images && workshop.images.length > 0) {
                workshop.images = await Promise.all(workshop.images.map(key => this.storageService.getFileUrl(key)));
            }
        }
        
        return result;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: IUpdateWorkshopDto, @CurrentUser() user: any) {
        return await this.useCase.update(id, data, user);
    }

    @Post('upload-logo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadLogo(@UploadedFile() file: Express.Multer.File) {
        const key = await this.storageService.uploadFile(file, 'workshops/logos');
        const url = await this.storageService.getFileUrl(key);
        return { key, url };
    }

    @Post('upload-images')
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
        const results = await Promise.all(files.map(async file => {
            const key = await this.storageService.uploadFile(file, 'workshops/images');
            const url = await this.storageService.getFileUrl(key);
            return { key, url };
        }));
        return results;
    }
}

