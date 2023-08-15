import { IsArray, IsNotEmpty } from "class-validator";

export class NewUserDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

}