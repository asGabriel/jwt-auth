import { Body, Controller, Delete, Get, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { isPublic } from 'src/decorator/ispublic.decorator';
import { DeleteUserDto } from './dto/delete-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    @Post('new')
    @isPublic()
    async create(@Body() data: NewUserDto) {
        return this.userService.create(data);
    }

    @Get()
    async getUser(@Req() req: Request, @Headers('Authorization') authHeader: string) {
        const decodedToken: TokenVerifiedDto = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return this.userService.getUser(validationResult, decodedToken);
    }

    @Get()
    async findByUsername(username: string) {
        return await this.userService.findByEmail(username);
    }

    @Delete()
    async delete(@Headers('Authorization') authHeader: string, data: DeleteUserDto) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.userService.delete(data, decodedToken)
        
    }
    
    @Get("/teste")
    async teste (@Req() req: Request, @Headers('Authorization') authHeader: string) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return validationResult
    }

}
