import { Body, Controller, Delete, Get, Post, UseGuards, Headers, SetMetadata, Put } from '@nestjs/common';
import { NewUserDto } from './dto/new-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { isPublic } from 'src/decorator/ispublic.decorator';
import { DeleteUserDto } from './dto/delete-user.dto';

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
    async getUser() {
        return this.userService.getUser();
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

}
