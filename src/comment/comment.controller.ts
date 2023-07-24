import { Body, Controller, Delete, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CommentService } from './comment.service';
import { NewCommentDto } from './dto/new-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ValidationResult } from 'src/auth/validation-resource-return';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService, private readonly authService: AuthService) { }

    @Post(":postId")
    async create(@Param("postId") postId: number, @Headers('Authorization') authHeader: string, @Body() data: NewCommentDto, @Req() req: Request) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.commentService.create(postId, decodedToken, data, req);
    }

    @Delete(":postId/:commentId")
    async delete(@Param("postId") postId: number, @Param("commentId") commentId: number, @Headers('Authorization') authHeader: string) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.commentService.delete(postId, commentId, decodedToken);
    }
    
    @Get()
    async teste(@Headers('Authorization') authHeader: string, @Req() req: Request) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return decodedToken
    }
}
