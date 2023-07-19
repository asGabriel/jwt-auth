import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RolePermissionDto {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsArray()
    permissionId: number
}