import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateParkingSubscriptionDto } from './create-parking-subscription.dto.js';

export class UpdateParkingSubscriptionDto extends PartialType(CreateParkingSubscriptionDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
