import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [context.getHandler(), context.getClass()]);

    if (!roles) {
      return true;
    }

    const user = context.switchToHttp().getRequest<FastifyRequest>().user;

    if (!user || !Array.isArray(user.roles)) {
      return false;
    }

    return user.roles.some((role: string) => roles.includes(role));
  }
}
