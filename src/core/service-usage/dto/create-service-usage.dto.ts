import {
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    Min,
    IsOptional,
    IsDateString,
} from 'class-validator';

export class CreateServiceUsageDto {
    @IsMongoId()
    studentId!: string;

    @IsNotEmpty()
    serviceName!: string;

    @IsNumber()
    @Min(0)
    unitPriceSnapshot!: number;

    @IsOptional()
    @IsDateString()
    usedAt?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number;
}
