import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsDateString, IsOptional } from 'class-validator';

export class RegisterDto {
  // ─── Student fields ─────────────────────────────
  @IsNotEmpty()
  @IsString()
  studentCode!: string;

  @IsNotEmpty()
  @IsString()
  studentName!: string;

  @IsNotEmpty()
  @Matches(/^\d{9,12}$/)
  idCard!: string;

  @IsDateString()
  dob!: string;

  @IsOptional()
  @IsString()
  class?: string;

  @IsOptional()
  @IsString()
  hometown?: string;

  // ─── User fields ────────────────────────────────
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
