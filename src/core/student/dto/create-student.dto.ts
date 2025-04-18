import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  studentCode!: string;

  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsString()
  @IsNotEmpty()
  idCard!: string;

  @IsDateString()
  @Type(() => Date)
  dob!: Date;

  @IsString()
  @IsOptional()
  class?: string;

  @IsString()
  @IsOptional()
  hometown?: string;
}
