import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { User } from './schemas/user.schema.js';
import { UserService } from './user.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: { name: string; email: string; roles: string[] }): Promise<User> {
    return this.userService.create(dto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }
}
