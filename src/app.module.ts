import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';

import { CommonModule, ExceptionsFilter } from './common';
import { configuration, loggerOptions } from './config';
import { AuthModule } from './auth';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),

    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env['NODE_ENV']}.local`,
        `.env.${process.env['NODE_ENV']}`,
        '.env',
      ],
      load: [configuration],
    }),

    // Static Folder
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),

    // Service Modules
    AuthModule, // Global for Middleware
    CommonModule, // Global

    // Module Router
    RouterModule.register([]),
  ],
  providers: [
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    { provide: APP_FILTER, useClass: ExceptionsFilter },

    // Global Pipe, Validation check
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // disableErrorMessages: true,
        transform: true, // transform object to DTO class
        whitelist: true,
      }),
    },
  ],
})
export class AppModule { }
