import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Delete,
} from '@nestjs/common';
import type { CreateServiceCatalogDto } from './dto/create-service-catalog.dto.js';
import type { ServiceCatalogService } from './service-catalog.service.js';
import type { UpdateServiceCatalogDto } from './dto/update-service-catalog.dto.js';

@Controller('service-catalog')
export class ServiceCatalogController {
    constructor(private readonly svc: ServiceCatalogService) { }

    @Post()
    create(@Body() dto: CreateServiceCatalogDto) {
        return this.svc.create(dto);
    }

    /**
     * List services.
     * Optional filter ?available=true|false
     */
    @Get()
    findAll(@Query('available') available?: string) {
        let flag: boolean | undefined;
        if (available === 'true') flag = true;
        else if (available === 'false') flag = false;
        return this.svc.findAll(flag);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.svc.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateServiceCatalogDto,
    ) {
        return this.svc.update(id, dto);
    }

    /** Soft-disable */
    @Delete(':id')
    disable(@Param('id') id: string) {
        return this.svc.disable(id);
    }

    /** Restore */
    @Post(':id/restore')
    restore(@Param('id') id: string) {
        return this.svc.restore(id);
    }
}
