import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './shared/interceptor/exception.interceptor';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Real IP handling behind proxies (Docker/Nginx)
  app.set('trust proxy', 'loopback');
  
  // Increase payload limits for image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.enableShutdownHooks()

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(9999)
}
bootstrap()
