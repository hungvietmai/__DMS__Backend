import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServiceCatalog, ServiceCatalogSchema } from './schemas/service-catalog.schema.js';
import { ServiceCatalogController } from './service-catalog.controller.js';
import { ServiceCatalogService } from './service-catalog.service.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: ServiceCatalog.name, schema: ServiceCatalogSchema }])],
  controllers: [ServiceCatalogController],
  providers: [ServiceCatalogService],
  exports: [ServiceCatalogService],
})
export class ServiceCatalogModule {}
