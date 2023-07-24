import { IsNotEmpty, IsNumber } from "class-validator";

export class NewCommentDto {
    @IsNotEmpty()
    @IsNumber()
    postId: number

    @IsNotEmpty()
    content: string;
}