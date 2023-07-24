import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { CommentService } from './comment.service';
import { NewCommentDto } from './dto/new-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService, private readonly authService: AuthService) { }

    @Post()
    async create(@Headers('Authorization') authHeader: string, @Body() data: NewCommentDto) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.commentService.create(decodedToken, data);
    }

    @Get()
    async getAll(@Headers('Authorization') authHeader: string, @Req() req: Request) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.commentService.getAll(decodedToken, validationResult)
    }

    @Put()
    async update(@Headers('Authorization') authHeader: string, @Req() req: Request, @Body() data: UpdateCommentDto) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.commentService.update(data, decodedToken, validationResult)
    }

    @Delete(":postId/:commentId")
    async delete(@Param("postId") postId: number, @Param("commentId") commentId: number, @Headers('Authorization') authHeader: string, @Req() req: Request) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.commentService.delete(postId, commentId, decodedToken, validationResult);
    }

}
