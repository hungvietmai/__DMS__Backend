import { Controller, Get, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { AuthService } from './auth.service.js';
import { JwtAuthGuard, LocalAuthGuard } from './guards/index.js';
import type { User } from '../shared/user/index.js';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public login(@Req() req: FastifyRequest): { access_token: string } {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.auth.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/check')
  public check(@Req() req: FastifyRequest): User {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
