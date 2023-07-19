import { IsNotEmpty } from "class-validator";

export class TokenVerifyDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;
}