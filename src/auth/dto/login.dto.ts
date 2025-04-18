import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  login!: string; // can be email or studentCode

  @IsNotEmpty()
  password!: string;
}
