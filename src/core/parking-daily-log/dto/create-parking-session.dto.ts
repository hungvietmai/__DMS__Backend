import { IsMongoId, IsDateString } from 'class-validator';

export class CreateParkingSessionDto {
  @IsMongoId()
  subscriptionId!: string;

  /** When the vehicle left */
  @IsDateString()
  outTime!: string;

  /** When it returned */
  @IsDateString()
  inTime!: string;
}
