import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    // Check if the route is public based on metadata
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = this.getRequest(context);
    return request.isAuthenticated();
  }

  public getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }
}
