import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadBucketCommand,
    CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly s3Client: S3Client;
    private readonly bucketName = process.env.MINIO_BUCKET || 'uploads';
    private readonly logger = new Logger(StorageService.name);

    constructor() {
        this.s3Client = new S3Client({
            endpoint: `http://${process.env.MINIO_ENDPOINT || 'minio'}:${process.env.MINIO_PORT || '9000'}`,
            region: 'us-east-1', // MinIO ignores this but it's required by the SDK
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
                secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    async onModuleInit() {
        await this.ensureBucketExists();
    }

    private async ensureBucketExists() {
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
            this.logger.log(`Bucket "${this.bucketName}" already exists.`);
        } catch (error) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                this.logger.log(`Bucket "${this.bucketName}" does not exist. Creating...`);
                await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
            } else {
                this.logger.error('Error checking bucket existence', error);
            }
        }
    }

    async uploadFile(file: Express.Multer.File, keyPrefix: string = 'general'): Promise<string> {
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        const key = `${keyPrefix}/${filename}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return key;
    }

    async getFileUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        let url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

        // Fix for development: if browser is outside docker network, replace 'minio' with 'localhost'
        const internalEndpoint = `${process.env.MINIO_ENDPOINT || 'minio'}:${process.env.MINIO_PORT || '9000'}`;
        const externalEndpoint = process.env.MINIO_EXTERNAL_ENDPOINT || 'localhost:9000';

        if (url.includes(internalEndpoint)) {
            url = url.replace(internalEndpoint, externalEndpoint);
        }

        return url;
    }

    async deleteFile(key: string): Promise<void> {
        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }),
        );
    }
}
