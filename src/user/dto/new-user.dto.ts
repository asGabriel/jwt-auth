import { IsNotEmpty } from "class-validator";

export class NewUserDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    email: string;

}