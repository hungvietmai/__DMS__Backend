import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import type { CreateServiceUsageDto } from './dto/create-service-usage.dto.js';
import type { ServiceUsageService } from './service-usage.service.js';


@Controller('service-usages')
export class ServiceUsageController {
    constructor(private readonly svc: ServiceUsageService) { }

    /** POST /service-usages */
    @Post()
    create(@Body() dto: CreateServiceUsageDto) {
        return this.svc.logUsage(dto);
    }

    /** GET /service-usages?studentId=&from=&to= */
    @Get()
    findAll(
        @Query('studentId') studentId?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        return this.svc.listUsages({ studentId, from, to });
    }
}
