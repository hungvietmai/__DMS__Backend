import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestVisit, GuestVisitSchema } from './schemas/guest-visit.schema.js';
import { GuestVisitService } from './guest-visit.service.js';
import { GuestVisitController } from './guest-visit.controller.js';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: GuestVisit.name, schema: GuestVisitSchema },
        ]),
    ],
    controllers: [GuestVisitController],
    providers: [GuestVisitService],
})
export class GuestVisitModule { }
