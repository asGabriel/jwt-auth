import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionDto } from './dto/role-permission.dto';

@Controller('role-permission')
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    @Post()
    async create(@Body() data: RolePermissionDto) {
        return await this.rolePermissionService.create(data);
    }

    @Delete()
    async delete(@Body() data: RolePermissionDto) {
        // return await this.rolePermissionService.delete(data);
    }

    @Get(":id")
    async getOne(@Param("id") userId: string) {
        // return await this.rolePermissionService.getOne(userId);
    }
}
