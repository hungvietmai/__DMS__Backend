import { IsMongoId, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  studentId!: string;

  @IsMongoId()
  roomId!: string;

  /** ISO date string for the first day of the month */
  @IsDateString()
  from!: string;
}
