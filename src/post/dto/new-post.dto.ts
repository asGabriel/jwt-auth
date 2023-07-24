import { IsNotEmpty, IsNumber } from "class-validator";

export class NewPostDto { 
    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;
}