import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { NewPermissionDto } from './dto/new-permission.dto';

@Injectable()
export class PermissionService {
    constructor(private prismaService: PrismaService) { }

    async createPermission(data: NewPermissionDto) {
        try {
            const validDto: NewPermissionDto = { name: data.name, resourceId: data.resourceId }
        } catch (error) {
            throw new BadRequestException("Invalid data.")
        }

        switch (data.name) {
            case "get":
            case "post":
            case "update":
            case "delete":
                break;
            default:
                throw new BadRequestException("Invalid data.")
        }

        const validPermission = await this.prismaService.permission.findFirst({
            where: {
                name: data.name, resourceId: data.resourceId
            }
        })
        if (validPermission) throw new ConflictException("The permission already exists.")

        const newPermission = await this.prismaService.permission.create({
            data: {
                name: data.name.toLowerCase(),
                resourceId: data.resourceId,
                owneronly: true
            }
        })

        return {
            message: "Permission registered",
            status: HttpStatus.CREATED,
            return: newPermission
        }
    }

    async allPermissions() {
        const permissions = await this.prismaService.permission.findMany({ include: { resource: true } })
        if (!permissions) throw new NotFoundException("No permissions created.")

        return {
            message: "Permissions returned ",
            status: HttpStatus.ACCEPTED,
            return: permissions
        }
    }

    async onePermission(permissionId: number) {
        const onePermission = await this.prismaService.permission.findUnique({
            where: {
                id: Number(permissionId)
            }, include: {
                resource: true
            }
        })
        if (!onePermission) throw new NotFoundException("Permission do not exists.")

        return {
            message: "Permission returned",
            status: HttpStatus.ACCEPTED,
            return: onePermission
        }
    }

    async deletePermission(permissionId: number) {
        const onePermission = await this.prismaService.permission.findUnique({
            where: {
                id: Number(permissionId)
            }
        })
        if (!onePermission) throw new NotFoundException("Permission do not exists.")

        const deletedPermission = await this.prismaService.permission.delete({
            where: {
                id: Number(permissionId)
            }
        })

        return {
            message: "Permission deleted.",
            status: HttpStatus.ACCEPTED,
            return: deletedPermission
        }
    }
}
