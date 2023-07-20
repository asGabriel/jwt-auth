import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewPermissionDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    resourceId: number
}