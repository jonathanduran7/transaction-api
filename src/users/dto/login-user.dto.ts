import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";


export class UserDto {

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;
}