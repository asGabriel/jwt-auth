import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { NewPermissionDto } from './dto/new-permission.dto';

@Controller('permission')
export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ) {}

    @Post()
    async create(data: NewPermissionDto) {
        return await this.permissionService.createPermission(data)
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
