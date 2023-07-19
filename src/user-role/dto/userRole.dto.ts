import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserRoleDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsNumber()
    roleId: number;
}