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

    async create(data: NewPostDto, token: TokenVerifiedDto, validationResult: ValidationResult): Promise<Post> {
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

    async update(id: number, data: NewPostDto, validationResult: ValidationResult, token: TokenVerifiedDto): Promise<Post> {
        try {
            if (validationResult.owneronly = true) {
                const ownPost = await this.prisma.post.findFirst({ where: { id: Number(id), author: token.email } })
                if (!ownPost) throw new NotFoundException("Post not found.")

                const updatedPost = await this.prisma.post.update({
                    where: { id: Number(id) }, data: {
                        title: data.title,
                        content: data.content
                    }
                })
                return updatedPost
            } else {
                const postExists = await this.prisma.post.findUnique({ where: { id: Number(id) } })
                if (!postExists) {
                    throw new NotFoundException("Post not found.")
                }

                const updatedPost = await this.prisma.post.update({
                    where: { id: Number(id) }, data: {
                        title: data.title,
                        content: data.content
                    }
                })
                return updatedPost;
            }

        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: number, validationResult: ValidationResult, token: TokenVerifiedDto): Promise<String> {
        try {
            if (validationResult.owneronly = true) {
                const ownPost = await this.prisma.post.findFirst({ where: { id: Number(id), author: token.email } })
                if (!ownPost) throw new NotFoundException("Post not found.")

                await this.prisma.post.delete({ where: { id: ownPost.id } })
                return `Post ${id} has been deleted.`
            } else {
                const postExists = await this.prisma.post.findUnique({ where: { id: Number(id) } })
                if (!postExists) {
                    throw new NotFoundException("Post not found.")
                }

                await this.prisma.post.delete({
                    where: {
                        id: Number(id)
                    }
                })

                return `Post ${id} has been deleted.`
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
