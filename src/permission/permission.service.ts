import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NewPermissionDto } from './dto/new-permission.dto';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';
import { ValidationResult } from 'src/auth/validation-resource-return';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionService {
    constructor(private prismaService: PrismaService) { }

    async createPermission(data: NewPermissionDto, decodedToken: TokenVerifiedDto, validationResult: ValidationResult): Promise<Permission> {
        try {
            switch (data.permission) {
                case "get":
                case "post":
                case "put":
                case "delete":
                    break;
                default:
                    throw new BadRequestException("Invalid data.")
            }

            const resource = await this.prismaService.resource.findUnique({
                where: {
                    name: data.resource
                }
            })
            if (!resource) throw new NotFoundException("Resource not found.")

            const validPermission = await this.prismaService.permission.findFirst({
                where: {
                    name: data.permission, resourceId: resource.id
                }
            })
            if (validPermission) throw new ConflictException("The permission already exists.")

            const newPermission = await this.prismaService.permission.create({
                data: {
                    name: data.permission.toLowerCase(),
                    resourceId: resource.id,
                }
            })

            const conectedPermission = await this.prismaService.permission.update({
                where: {
                    id: newPermission.id
                }, data: {
                    resource: {
                        connect: {
                            id: newPermission.resourceId
                        }
                    }
                }, include: {
                    resource: true, roles: true
                }
            })

            return conectedPermission
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async allPermissions() {
        try {
            const permissions = await this.prismaService.permission.findMany({ include: { resource: true } })
            if (!permissions) throw new NotFoundException("No permissions created.")

            return {
                message: "Permissions returned ",
                status: HttpStatus.ACCEPTED,
                return: permissions
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async onePermission(permissionId: number) {
        try {

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
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async deletePermission(permissionId: number) {
        try {
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
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
