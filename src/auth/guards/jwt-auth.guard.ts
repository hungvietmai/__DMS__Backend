import { type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public override getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }
}
