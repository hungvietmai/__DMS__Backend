import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';

import type { CreateParkingSubscriptionDto } from './dto/create-parking-subscription.dto.js';
import type { ParkingSubscriptionService } from './parking-subscription.service.js';

@Controller('parking-subscriptions')
export class ParkingSubscriptionController {
  constructor(private readonly svc: ParkingSubscriptionService) {}

  @Post()
  create(@Body() dto: CreateParkingSubscriptionDto) {
    return this.svc.create(dto);
  }

  /** GET /parking-subscriptions?studentId=... */
  @Get()
  findAll(@Query('studentId') studentId?: string) {
    return this.svc.findAll(studentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateParkingSubscriptionDto) {
    return this.svc.update(id, dto);
  }

  /** Soft‑disable */
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.svc.deactivate(id);
  }

  /** Reactivate */
  @Post(':id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.svc.reactivate(id);
  }
}
