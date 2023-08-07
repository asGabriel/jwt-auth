import { Body, Controller, Delete, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { NewPermissionDto } from './dto/new-permission.dto';
import { PermissionService } from './permission.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('permission')
@UseGuards(AuthGuard)
export class PermissionController {
    constructor(
        private permissionService: PermissionService,
        private authService: AuthService,
    ) { }

    @Post()
    async create(@Req() req: Request, @Headers('Authorization') authHeader: string, @Body() data: NewPermissionDto) {
        const decodedToken = await this.authService.verifyToken(authHeader);
        const validationResult: ValidationResult = req['context'];
        return await this.permissionService.createPermission(data, decodedToken, validationResult);
    }

    @Get()
    async getAll() {
        return await this.permissionService.allPermissions()
    }

    @Get(":id")
    async getOne(@Param("id") permissionId: number) {
        return await this.permissionService.onePermission(permissionId)
    }

    @Delete(":id")
    async delete(@Param("id") permissionId: number) {
        return await this.permissionService.deletePermission(permissionId)
    }
}
