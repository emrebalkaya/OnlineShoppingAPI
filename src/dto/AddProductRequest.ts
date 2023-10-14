import { IsNotEmpty, Min, IsString, IsNumber, IsOptional } from 'class-validator';

export class AddProductRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    stock: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsOptional()
    @IsString()
    description?: string;
}
