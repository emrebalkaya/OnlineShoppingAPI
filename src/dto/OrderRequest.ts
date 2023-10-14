import { IsNotEmpty, IsArray, IsNumber, min, Min } from "class-validator";

export class OrderRequest {
    @IsNumber({}, { message: "customerId must be a valid number" })
    @IsNotEmpty({ message: "customerId is required" })
    customerId: number;

    @IsArray({ message: "productIds must be an array of numbers" })
    @IsNotEmpty({ message: "productIds is required" })
    productIds: number[];

    @IsNumber({}, { message: "totalAmount must be a valid number" })
    @Min(0, {message: "totalAmount must be greater than or equal to 0"})
    @IsNotEmpty({ message: "totalAmount is required" })
    totalAmount: number;
}