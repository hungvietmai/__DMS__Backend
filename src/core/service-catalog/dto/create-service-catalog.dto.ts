import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateServiceCatalogDto {
    @IsNotEmpty()
    serviceCode!: string;

    @IsNotEmpty()
    serviceName!: string;

    @IsNumber()
    @Min(0)
    unitPrice!: number;

    @IsString()
    unit!: string;
}
