import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateTransferDto {
    @IsNumber()
    accountFrom: number;

    @IsNumber()
    accountTo: number;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    description: string;
}