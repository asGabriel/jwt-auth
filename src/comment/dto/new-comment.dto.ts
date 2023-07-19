import { IsNotEmpty } from "class-validator";

export class NewCommentDto {
    @IsNotEmpty()
    content: string;
}