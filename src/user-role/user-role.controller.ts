import { Body, Controller, Delete, Post, UseGuards, Headers, Get } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleDto } from './dto/userRole.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user-role')
@UseGuards(AuthGuard)
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService, private readonly authService: AuthService) { }

    @Post()
    async create(@Body() data: UserRoleDto) {
        return await this.userRoleService.create(data);
    }

    @Get()
    async getUnique(@Headers('Authorization') authHeader: string) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        return await this.userRoleService.getUnique(decodedToken)
    }

    @Delete()
    async delete(@Body() data: UserRoleDto) {
        return await this.userRoleService.delete(data);
    }
}
