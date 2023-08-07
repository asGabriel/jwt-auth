import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class NewPermissionDto {
    @IsNotEmpty()
    @IsString()
    permission: string
    
    @IsNotEmpty()
    @IsString()
    resource: string

    @IsNotEmpty()
    @IsBoolean()
    owneronly: boolean
}