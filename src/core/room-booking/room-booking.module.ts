import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoomBookingService } from './room-booking.service.js';
import { RoomBooking, RoomBookingSchema } from './schemas/room-booking.schema.js';
import { Room, RoomSchema } from '../room/schemas/room.schema.js';
import { Student, StudentSchema } from '../student/schemas/student.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomBooking.name, schema: RoomBookingSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  providers: [RoomBookingService],
  exports: [RoomBookingService],
})
export class RoomBookingModule {}
