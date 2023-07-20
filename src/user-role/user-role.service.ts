import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { UserRoleDto } from './dto/userRole.dto';
import { TokenVerifyDto } from 'src/auth/dto/token-verify.dto';

@Injectable()
export class UserRoleService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: UserRoleDto) {
        try {
            const role = await this.prismaService.role.findUnique({
                where: {
                    id: Number(data.roleId)
                }
            })
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: data.userId
                }
            })

            await this.prismaService.role.update({
                where: { id: role.id },
                data: {
                    users: { connect: { id: String(user.id) } }
                }
            });

            return { message: 'Relationship user-role sucessfully created.' };
        } catch (error) {
            throw new NotFoundException('Error to create user-role relationship.');
        }
    }

    async getUnique(token: TokenVerifyDto) {
        const userRole = await this.prismaService.role.findMany({
            where: {
                users: {
                    some: {
                        email: token.email,
                    },
                },
            },
        });

        return userRole;
    }

    async delete(data: UserRoleDto) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: data.userId }
            });

            const role = await this.prismaService.role.findUnique({
                where: {
                    id: Number(data.roleId)
                }
            })

            await this.prismaService.role.update({
                where: { id: role.id },
                data: {
                    users: { disconnect: { id: String(user.id) } }
                }
            });

            return { message: "Relationship user-role has been deleted." }
        } catch (error) {
            return { message: error.message }
        }
    }
}
