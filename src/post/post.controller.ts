import { Body, Controller, Post, Headers, UseGuards, Get, SetMetadata, Param, Put, Delete, Req } from '@nestjs/common';
import { NewPostDto } from './dto/new-post.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from './post.service';
import { isPublic } from 'src/decorator/ispublic.decorator';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { Request } from 'express';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
    constructor(private readonly authService: AuthService, private readonly postService: PostService) { }

    @Post()
    async create(@Body() data: NewPostDto, @Headers('Authorization') authHeader: string) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.postService.create(data, decodedToken)
    }

    @Get()
    @isPublic()
    async getAll() {
        return await this.postService.getAll();
    }

    @Get(":id")
    @isPublic()
    async getOne(@Param("id") id: number) {
        return await this.postService.getOne(id);
    }

    @Put()
    async update(@Body() data: NewPostDto, @Headers('Authorization') authHeader: string, @Req() req: Request) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.postService.update(data, validationResult, decodedToken);
    }
    
    @Delete(":id")
    async delete(@Param("id") id: number, @Headers('Authorization') authHeader: string, @Req() req: Request) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.postService.delete(id, validationResult, decodedToken);
    }
}
