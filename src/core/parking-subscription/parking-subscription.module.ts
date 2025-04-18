import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParkingSubscriptionController } from './parking-subscription.controller.js';
import { ParkingSubscriptionService } from './parking-subscription.service.js';
import { ParkingSubscription, ParkingSubscriptionSchema } from './schemas/parking-subscription.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: ParkingSubscription.name, schema: ParkingSubscriptionSchema }])],
  controllers: [ParkingSubscriptionController],
  providers: [ParkingSubscriptionService],
  exports: [ParkingSubscriptionService],
})
export class ParkingSubscriptionModule {}
