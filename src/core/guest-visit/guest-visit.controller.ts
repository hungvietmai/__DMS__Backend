import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import type { CreateGuestVisitDto } from './dto/create-guest-visit.dto.js';
import type { GuestVisitService } from './guest-visit.service.js';


@Controller('guest-visits')
export class GuestVisitController {
    constructor(private readonly svc: GuestVisitService) { }

    /** Log a new visit (append‑only) */
    @Post()
    create(@Body() dto: CreateGuestVisitDto) {
        return this.svc.logVisit(dto);
    }

    /**
     * List visits.
     * Optionally filter by studentId, from, to
     */
    @Get()
    findAll(
        @Query('studentId') studentId?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        return this.svc.listVisits({ studentId, from, to });
    }
}
