import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { PrismaService } from 'src/database/prisma.service';
import { NewCommentDto } from './dto/new-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(decodedToken: TokenVerifiedDto, data: NewCommentDto): Promise <Comment> {
        try {
            const post = await this.prismaService.post.findUnique({ where: { id: data.postId }, include: { comments: true } })
            if (!post) {
                throw new NotFoundException('Post not found.');
            }

            const newComment = this.prismaService.comment.create({
                data: {
                    content: data.content,
                    author: decodedToken.email,
                    postId: data.postId
                }, include: {
                    post: true
                }
            })
            return newComment;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAll(decodedToken: TokenVerifiedDto, validationResult: ValidationResult) {
        try {
            let comment: Comment[] | null = null
            // if(validationResult.owneronly) {
            //     comment = await this.prismaService.comment.findMany({
            //         where: {
            //             author: decodedToken.email
            //         }
            //     })
            // } else {
            //     comment = await this.prismaService.comment.findMany()
            // }
            if(!comment) throw new NotFoundException("No comments found.")

            return comment
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(data: UpdateCommentDto, decodedToken: TokenVerifiedDto, validationResult: ValidationResult): Promise<Comment> {
        try {
            const post = await this.prismaService.post.findUnique({ where: { id: Number(data.postId) }, include: { comments: true } })
            if (!post) throw new NotFoundException("Invalid post id.");

            let comment: Comment | null = null
            // if (validationResult.owneronly) {
            //     comment = await this.prismaService.comment.findUnique({ where: { id: Number(data.commentId), author: decodedToken.email } })
            // } else {
            //     comment = await this.prismaService.comment.findUnique({ where: { id: Number(data.commentId) } })
            // }
            if (!comment) throw new NotFoundException("Invalid comment id.")

            const updatedComment: Comment = await this.prismaService.comment.update({
                where:{
                    id: comment.id
                }, data: {
                    content: data.content
                }, include: {
                    post: true
                }
            })

            return updatedComment
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(postId: number, commentId: number, decodedToken: TokenVerifiedDto, validationResult: ValidationResult): Promise<String> {
        try {
            const post = await this.prismaService.post.findUnique({ where: { id: Number(postId) }, include: { comments: true } })
            if (!post) throw new NotFoundException("Invalid post id.");

            let comment: Comment | null = null
            // if (validationResult.owneronly = true) {
            //     comment = await this.prismaService.comment.findUnique({ where: { id: Number(commentId), author: decodedToken.email } })
            // } else {
            //     comment = await this.prismaService.comment.findUnique({ where: { id: Number(commentId) } })
            // }
            if (!comment) throw new NotFoundException("Invalid comment id.")

            await this.prismaService.comment.delete({
                where: {
                    id: Number(comment.id)
                }
            })

            return `Comment ${commentId} has been deleted.`
        } catch (error) {
            throw new BadRequestException(error.message)
        }

    }

}
