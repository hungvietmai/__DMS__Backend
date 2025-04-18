import {
  Injectable,
  type NestMiddleware,
} from '@nestjs/common';
import type {
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import { PinoLogger } from 'nestjs-pino';

import { AuthService } from '../../auth/auth.service.js';
import type { Payload } from '../../auth/auth.interface.js';

type RequestWithUser = FastifyRequest & {
  user?: Payload;
};

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: PinoLogger,
    private readonly auth: AuthService,
  ) { }

  use(
    req: RequestWithUser,
    _res: FastifyReply,
    next: () => void,
  ): void {
    let userId: string | undefined;

    // 1) If JWT guard already ran, req.user is your Payload
    if (req.user?.userId) {
      userId = req.user.userId;
    }
    else {
      // 2) Fallback: parse raw Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const payload = this.auth.getPayload(token);
        userId = payload?.userId;
      }
    }

    // 3) Attach to Pino context
    this.logger.assign({ userId });

    next();
  }
}
