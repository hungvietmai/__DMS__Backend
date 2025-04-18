import { IsMongoId, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateParkingSubscriptionDto {
  @IsMongoId()
  studentId!: string;

  @IsNotEmpty()
  licensePlate!: string;

  @IsEnum(['bike', 'motorbike', 'car'])
  vehicleType!: 'bike' | 'motorbike' | 'car';

  /** ISO date string; defaults to now if omitted */
  @IsOptional()
  @IsDateString()
  startedAt?: string;
}
