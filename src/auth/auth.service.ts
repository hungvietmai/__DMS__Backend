import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { JwtPayload, JwtSign, Payload } from './auth.interface.js';
import { UserService } from '../shared/user/user.service.js';
import type { User } from '../shared/user/schemas/user.schema.js';
import { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { StudentService } from '../core/student/student.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly studentService: StudentService,
  ) { }

  /** Handles registration of both Student and User, returns tokens */
  async register(dto: RegisterDto): Promise<{ student: any; user: any; tokens: JwtSign }> {
    // 1) Create student record
    const student = await this.studentService.create({
      studentCode: dto.studentCode,
      studentName: dto.studentName,
      idCard: dto.idCard,
      dob: new Date(dto.dob),
      class: dto.class,
      hometown: dto.hometown,
    });

    // 2) Create user linked to that student
    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      studentId: student._id.toString(),
    });

    // 3) Issue tokens
    const payload: JwtPayload = {
      sub: student._id.toString(),
      username: user.email,
      roles: [user.role],
    };
    const tokens: JwtSign = {
      access_token: this.jwt.sign(payload),
      refresh_token: this.jwt.sign(
        { sub: payload.sub },
        {
          secret: this.config.get<string>('jwtRefreshSecret'),
          expiresIn: '7d',
        },
      ),
    };

    return { student, user, tokens };
  }

  /**
   * Log in with email or studentCode + password.
   * Returns both access_token and refresh_token.
   */
  async login(dto: LoginDto): Promise<JwtSign> {

    // 1. Validate credentials
    const user: User | null = await this.userService.validateUser(
      dto.login,
      dto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Prepare payload
    const payload: JwtPayload = {
      sub: user.studentId.toString(),
      username: user.email,
      roles: [user.role],
    };

    // 3. Sign and return both tokens
    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.jwt.sign(
        { sub: payload.sub },
        {
          secret: this.config.get<string>('jwtRefreshSecret'),
          expiresIn: '7d',
        },
      ),
    };
  }

  /**
   * Verify that the given refreshToken is valid
   * and actually belongs to the user in `data`.
   */
  validateRefreshToken(data: Payload, refreshToken: string): boolean {
    try {
      const verified = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('jwtRefreshSecret'),
      });
      return verified.sub === data.userId;
    } catch {
      return false;
    }
  }

  /**
   * Decode either token without throwing.
   */
  getPayload(token: string): Payload | null {
    try {
      const p = this.jwt.decode<JwtPayload>(token);
      if (!p) return null;
      return {
        userId: p.sub,
        username: p.username,
        roles: p.roles,
      };
    } catch {
      return null;
    }
  }
}
