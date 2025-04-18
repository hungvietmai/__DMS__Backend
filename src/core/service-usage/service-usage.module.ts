import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceUsage, ServiceUsageSchema } from './schemas/service-usage.schema.js';
import { ServiceUsageController } from './service-usage.controller.js';
import { ServiceUsageService } from './service-usage.service.js';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ServiceUsage.name, schema: ServiceUsageSchema },
        ]),
    ],
    controllers: [ServiceUsageController],
    providers: [ServiceUsageService],
    exports: [ServiceUsageService],
})
export class ServiceUsageModule { }
