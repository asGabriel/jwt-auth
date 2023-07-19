import { Body, Controller, Post, Headers, UseGuards, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewCommentDto } from './dto/new-comment.dto';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService, private readonly authService: AuthService) { }

    @Post(":postId")
    async create(@Param("postId") postId: number, @Headers('Authorization') authHeader: string, @Body() data: NewCommentDto) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.commentService.create(postId, decodedToken, data);
    }

    @Delete(":postId/:commentId")
    async delete(@Param("postId") postId: number, @Param("commentId") commentId: number, @Headers('Authorization') authHeader: string) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.commentService.delete(postId, commentId, decodedToken);
    }
}
