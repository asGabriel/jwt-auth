import { IsDateString, IsEmail, IsString } from "class-validator";

export class UserCreatedDto {
    @IsString()
    id: string

    @IsEmail()
    email: string

    @IsDateString()
    createdAt: Date
}