import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './shared/interceptor/response.interceptor'
import { GlobalExceptionFilter } from './shared/interceptor/exception.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(9999)
}
bootstrap()
