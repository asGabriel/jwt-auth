import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsNotEmpty()
    @IsNumber()
    postId: number

    @IsNotEmpty()
    @IsNumber()
    commentId: number

    @IsNotEmpty()
    @IsString()
    content: string;
}