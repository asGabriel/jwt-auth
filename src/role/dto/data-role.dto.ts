import { IsNotEmpty, IsString } from "class-validator";

export class DataRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string
}