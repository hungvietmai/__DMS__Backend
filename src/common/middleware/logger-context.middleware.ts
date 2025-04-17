import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { PinoLogger } from 'nestjs-pino';

import { AuthService } from '../../auth/index.js';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: PinoLogger,
    private auth: AuthService,
  ) { }

  public use(req: FastifyRequest, _res: FastifyReply, next: () => void): void {
    const authHeader = req.headers.authorization;
    let userId: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const payload = this.auth.getPayload(token);
        userId = payload?.userId;
      } catch {
        // Ignore invalid token
      }
    } else {
      userId = req.user?.id;
    }

    this.logger.assign({ userId });

    next();
  }
}
