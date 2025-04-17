import { Global, type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';

import { LoggerContextMiddleware } from './middleware/index.js';
import * as providers from './providers/index.js';
import { AuthModule } from '../auth/auth.module.js';
import { LoggerModule } from 'nestjs-pino';

const services = Object.values(providers);

@Global()
@Module({
  imports: [AuthModule, LoggerModule],
  providers: services,
  exports: services,
})
export class CommonModule implements NestModule {
  // Global Middleware
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
