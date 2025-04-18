import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceCatalogDto } from './create-service-catalog.dto.js';

export class UpdateServiceCatalogDto extends PartialType(CreateServiceCatalogDto) {
    isAvailable?: boolean;
}