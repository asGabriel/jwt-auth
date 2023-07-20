import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { NewPostDto } from './dto/new-post.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenVerifyDto } from 'src/auth/dto/token-verify.dto';
import { PostEntityDto } from './dto/post-entity.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async create(data: NewPostDto, token: TokenVerifyDto) {

        const newPost = await this.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                author: token.username
            },
        });

        return newPost;

    }

    async getAll() {
        const posts = await this.prisma.post.findMany({
            select: {
                id: true, title: true, author: true, content: true, createdAt: true, updatedAt: true, comments: true
            }
        })

        if(!posts) throw new NotFoundException("No posts to show.")

        return {
            message: "Success.",
            status: HttpStatus.ACCEPTED,
            return: posts
        }
    }

    // async getAll() {
    //     return new Promise((resolve, reject) => {
    //         this.prisma.post
    //             .findMany({include: {comments: true}})
    //             .then((posts) => {
    //                 const postDtos: PostEntityDto[] = posts.map((post) => ({
    //                     id: post.id,
    //                     title: post.title,
    //                     content: post.content,
    //                     author: post.author,
    //                     createdAt: post.createdAt,
    //                     updatedAt: post.updatedAt,
    //                     comments: post.comments
    //                 }));
    //                 resolve(postDtos);
    //             })
    //             .catch((error) => {
    //                 reject(error);
    //             });
    //     });
    // }

    async getOne(id: number) {
        const post = await this.prisma.post.findUnique({ where: { id: Number(id) }, include: { comments: true } })
        if (!post) {
            throw new NotFoundException('Post not found.');
        }
        return post;
    }

    async update(id: number, data: NewPostDto) {
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

    async delete(id: number) {
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
}
