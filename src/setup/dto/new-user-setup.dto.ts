import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class NewUserSetupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}