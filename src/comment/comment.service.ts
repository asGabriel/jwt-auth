import { Injectable, NotFoundException } from '@nestjs/common';
import { NewCommentDto } from './dto/new-comment.dto';
import { TokenVerifyDto } from 'src/auth/dto/token-verify.dto';
import { PrismaService } from 'src/database-sqlite/prisma.service';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(postId: number, decodedToken: TokenVerifyDto, data: NewCommentDto) {
        const post = await this.prismaService.post.findUnique({ where: { id: Number(postId) }, include: { comments: true } })
        if (!post) {
            throw new NotFoundException('Post not found.');
        }

        const newComment = this.prismaService.comment.create({
            data: {
                content: data.content,
                author: decodedToken.username,
                createdAt: new Date(),
                postId: Number(postId)
            }
        })
        return newComment;
    }

    async delete(postId: number, commentId: number, decodedToken: TokenVerifyDto) {
        const post = await this.prismaService.post.findUnique({ where: { id: Number(postId) }, include: { comments: true } })
        if (!post) {
            throw new NotFoundException;
        }

        const comment = await this.prismaService.comment.findUnique({ where: { id: Number(commentId) } })
        if (!comment) {
            throw new NotFoundException;
        }

        return await this.prismaService.comment.delete({
            where: {
                id: Number(commentId)
            }
        })

    }

}
