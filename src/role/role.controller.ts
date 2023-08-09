import { Controller, UseGuards, Headers, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { DataRoleDto } from './dto/data-role.dto';
import { AuthService } from 'src/auth/auth.service';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { Request } from 'express';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';

@Controller('role')
@UseGuards(AuthGuard)
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
        private readonly authService: AuthService
    ) { }

    async create(@Req() req: Request, @Headers('Authorization') authHeader: string, data: DataRoleDto) {
        const decodedToken: TokenVerifiedDto = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.roleService.create(data)
    }

}
