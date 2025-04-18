import { IsMongoId, IsNotEmpty, IsDateString, Matches } from 'class-validator';

export class CreateGuestVisitDto {
  @Matches(/^\d{9,12}$/, { message: 'guestIdCard must be 9–12 digits' })
  guestIdCard!: string;

  @IsNotEmpty()
  guestName!: string;

  /** optional */
  @IsDateString()
  guestDob?: string;

  @IsMongoId()
  studentId!: string;

  @IsDateString()
  visitedAt!: string;
}
