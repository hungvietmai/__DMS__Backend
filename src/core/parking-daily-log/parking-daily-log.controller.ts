import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';

import type { CreateParkingSessionDto } from './dto/create-parking-session.dto.js';
import type { ParkingDailyLogService } from './parking-daily-log.service.js';

@Controller()
export class ParkingDailyLogController {
  constructor(private readonly svc: ParkingDailyLogService) {}

  /** POST /parking-sessions */
  @Post('parking-sessions')
  logSession(@Body() dto: CreateParkingSessionDto) {
    return this.svc.logSession(dto);
  }

  /** GET /parking-daily-logs?subscriptionId=&from=&to= */
  @Get('parking-daily-logs')
  findDailyLogs(@Query('subscriptionId') subscriptionId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.listDailyLogs({ subscriptionId, from, to });
  }

  /** GET /students/:studentId/parking-sessions?from=&to= */
  @Get('students/:studentId/parking-sessions')
  findStudentSessions(@Param('studentId') studentId: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.listStudentSessions(studentId, from, to);
  }
}
