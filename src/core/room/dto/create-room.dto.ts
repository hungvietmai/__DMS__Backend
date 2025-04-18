import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  roomNo!: string;

  @IsEnum(['standard', 'vip'])
  roomType!: 'standard' | 'vip';

  @IsNumber()
  @Min(0)
  pricePerMonth!: number;

  @IsNumber()
  @Min(1)
  capacity!: number;
}
