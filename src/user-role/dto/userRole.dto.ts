import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UserRoleDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsArray()
    roles: string[];
}