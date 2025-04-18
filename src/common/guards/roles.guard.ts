import type { Payload } from '@/auth/auth.interface.js';
import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!required) return true;

    const req = ctx.switchToHttp().getRequest<{ user: Payload }>();
    const user = req.user;
    if (!user || !Array.isArray(user.roles)) return false;
    return user.roles.some(r => required.includes(r));
  }
}