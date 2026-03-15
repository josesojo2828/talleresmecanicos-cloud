import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageTestController } from './storage-test.controller';

@Global()
@Module({
    controllers: [StorageTestController],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule { }
