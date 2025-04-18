import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GuestVisitController } from './guest-visit.controller.js';
import { GuestVisitService } from './guest-visit.service.js';
import { GuestVisit, GuestVisitSchema } from './schemas/guest-visit.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: GuestVisit.name, schema: GuestVisitSchema }])],
  controllers: [GuestVisitController],
  providers: [GuestVisitService],
})
export class GuestVisitModule {}
