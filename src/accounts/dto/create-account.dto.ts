import { IsNumber } from "class-validator";

export class CreateAccountDto {
    @IsNumber()
    currencyId: number;

    @IsNumber()
    balance: number;
}