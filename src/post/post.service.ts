import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { NewPostDto } from './dto/new-post.dto';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async create(data: NewPostDto, token: TokenVerifiedDto): Promise<Post> {
        try {
            const newPost = await this.prisma.post.create({
                data: {
                    title: data.title,
                    content: data.content,
                    author: token.email
                },
            });
            return newPost;
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getAll(): Promise<Post[]> {
        try {
            const posts = await this.prisma.post.findMany()
            if (!posts) throw new NotFoundException("No posts to show.")
            return posts
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getOne(id: number): Promise<Post> {
        try {
            const post = await this.prisma.post.findUnique({ where: { id: Number(id) }, include: { comments: true } })
            if (!post) {
                throw new NotFoundException('Post not found.');
            }
            return post;
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(data: NewPostDto, validationResult: ValidationResult, token: TokenVerifiedDto): Promise<Post> {
        try {
            let post: Post | null = null
            if (validationResult.owneronly) {
                post = await this.prisma.post.findFirst({ where: { id: data.postId, author: token.email }, include: { comments: true } })
            } else {
                post = await this.prisma.post.findUnique({ where: { id: data.postId }, include: { comments: true } })
            }
            if (!post) throw new NotFoundException("Post not found.")

            const updatedPost = await this.prisma.post.update({
                where: { id: post.id }, data: {
                    title: data.title,
                    content: data.content
                }
            })
            
            return updatedPost
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: number, validationResult: ValidationResult, token: TokenVerifiedDto): Promise<String> {
        try {
            let post: Post | null = null
            if (validationResult.owneronly) {
                post = await this.prisma.post.findFirst({ where: { id: Number(id), author: token.email }, include: { comments: true } })
            } else {
                post = await this.prisma.post.findUnique({ where: { id: Number(id) }, include: { comments: true } })
            }
            if (!post) throw new NotFoundException("Post not found.")

            await this.prisma.post.delete({ where: { id: post.id }})

            return `Post ${id} has been deleted.`
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
