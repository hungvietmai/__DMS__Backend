// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { UserService } from '../shared/user/user.service.js';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard, LocalAuthGuard } from './guards/index.js';
import { RegisterDto } from './dto/register.dto.js';

interface RequestWithUser extends ExpressRequest {
  user: { userId: string; username: string; roles: string[] };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() dto: LoginDto) {
    // req.user set by LocalStrategy
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: RequestWithUser) {
    return this.userService.findById(req.user.userId);
  }
}