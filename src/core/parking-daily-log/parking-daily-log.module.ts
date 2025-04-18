import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParkingDailyLogController } from './parking-daily-log.controller.js';
import { ParkingDailyLogService } from './parking-daily-log.service.js';
import { ParkingDailyLog, ParkingDailyLogSchema } from './schemas/parking-daily-log.schema.js';
import { ParkingSubscription, ParkingSubscriptionSchema } from '../parking-subscription/schemas/parking-subscription.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ParkingSubscription.name, schema: ParkingSubscriptionSchema },
      { name: ParkingDailyLog.name, schema: ParkingDailyLogSchema },
    ]),
  ],
  controllers: [ParkingDailyLogController],
  providers: [ParkingDailyLogService],
  exports: [ParkingDailyLogService],
})
export class ParkingDailyLogModule {}
