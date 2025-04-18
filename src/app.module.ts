import { Module, ValidationPipe, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/index.js';
import { CommonModule, ExceptionsFilter, LoggerContextMiddleware } from './common/index.js';
import { configuration, loggerOptions } from './config/index.js';
import { ServiceCatalogModule } from './core/service-catalog/service-catalog.module.js';
import { DatabaseModule } from './database/index.js';
import { HealthModule } from './health/index.js';
import { UserModule } from './shared/user/index.js';

@Module({
  imports: [
    // https://github.com/iamolegga/nestjs-pino
    LoggerModule.forRoot(loggerOptions),
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env'],
      load: [configuration],
    }),
    // Static
    ServeStaticModule.forRoot({
      rootPath: `${import.meta.dirname}/../public`,
    }),

    // Global
    CommonModule,

    // Terminus
    HealthModule,

    // Authentication
    AuthModule,

    DatabaseModule,

    UserModule,

    ServiceCatalogModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  // Global Middleware
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
