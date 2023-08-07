import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { DataRoleDto } from './dto/data-role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async create(data: DataRoleDto): Promise<Role> {
        try {
            const role: Role = await this.prismaService.role.create({
                data: {
                    name: data.name
                }
            })

            return role
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async get(): Promise<Role[]> {
        try {
            const roles: Role[] = await this.prismaService.role.findMany()
            if(!roles) throw new NotFoundException
            return roles
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getOne(roleId: number): Promise<Role> {
        try {
            const role: Role = await this.prismaService.role.findUniqueOrThrow({
                where: {
                    id: Number(roleId)
                }
            })

            return role
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
    
    async update(roleId: number, data: DataRoleDto): Promise<Role> {
        try {
            const checkRole: Role = await this.prismaService.role.findUniqueOrThrow({
                where: {
                    name: data.name
                }
            })

            const updatedRole:Role = await this.prismaService.role.update({
                where: {
                    id: checkRole.id
                }, data: {
                    name: data.name,
                }
            })

            return updatedRole
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(roleId: number): Promise<void> {
        try {
            const checkRole: Role = await this.prismaService.role.findUniqueOrThrow({
                where: {
                    id: Number(roleId)
                }
            })

            await this.prismaService.role.delete({
                where: {
                    id: checkRole.id
                }
            })
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
