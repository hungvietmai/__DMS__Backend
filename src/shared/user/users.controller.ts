import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { User } from './schemas/user.schema.js';
import { UserService } from './user.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    return this.userService.create(dto);
  }

  @Get()
  findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }
}
