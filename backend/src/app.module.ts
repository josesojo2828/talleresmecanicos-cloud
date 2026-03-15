import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PrismaService } from './config/prisma.service'
import { DataFixtures } from './fixtures/data.fixtures'
import { TimerMiddleware } from './shared/middleware/timer.middleware';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { RegionsModule } from './modules/regions/regions.module';
import SecurityModule from './modules/security/security.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import AppicationModule from './modules/app/app.module';
import { StorageModule } from './modules/storage/storage.module';
import { WorkshopModule } from './modules/workshop/workshop.module';
import { ForumModule } from './modules/forum/forum.module';
import { SupportModule } from './modules/support/support.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        // Agregamos '..' para salir de 'src' y entrar en la raíz de 'dist' donde están los locales
        path: path.join(__dirname, '..', 'locales/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      // Para el generador de tipos, usamos process.cwd() para que apunte a la raíz del proyecto
      typesOutputPath: path.join(process.cwd(), 'src/generated/i18n.generated.ts'),
    }),

    // # # # # # # #
    // #  MODULES  #
    // # # # # # # #
    RegionsModule,
    UserModule,
    AuthModule,
    WorkshopModule,
    ForumModule,
    SupportModule,
    ClientModule,

    // SECURITY
    SecurityModule,

    // APPLICATION
    AppicationModule,

    // STORAGE
    StorageModule,
  ],
  providers: [
    PrismaService,
    DataFixtures,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TimerMiddleware)
      .forRoutes('*'); // Aplica a todas las rutas
  }
}
