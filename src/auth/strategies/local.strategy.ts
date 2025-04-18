import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import type { User } from '@/shared/user/schemas/user.schema.js';
import { UserService } from '@/shared/user/user.service.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private user: UserService) {
    super();
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this.user.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('NotFoundUser');
    }

    return user;
  }
}
