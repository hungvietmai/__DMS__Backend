import { IsEmail, MinLength, Matches, IsMongoId, IsEnum, IsOptional } from 'class-validator';

import { UserRole } from '../schemas/user.schema.js';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  // at least 8 chars, 1 number, 1 letter
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password too weak',
  })
  password!: string;

  @IsMongoId()
  studentId!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
