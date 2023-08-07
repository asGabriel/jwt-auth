import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { UserRoleDto } from './dto/userRole.dto';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';

@Injectable()
export class UserRoleService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: UserRoleDto) {
        try {
            for (let i = 0; i < data.roles.length; i++) {
                console.log(data.roles[i])
                const roleCheck = await this.prismaService.role.findUnique({ where: { name: data.roles[i] } })
                if (!roleCheck) throw new NotFoundException(`Role ${data.roles[i]} does not exists.`)

                const userCheck = await this.prismaService.user.findUnique({ where: { id: data.userId } })
                if (!userCheck) throw new NotFoundException(`UserId ${data.userId} does not exists.`)

                await this.prismaService.role.update({
                    where: {
                        id: roleCheck.id
                    }, data: {
                        User: {
                            connect: {
                                id: userCheck.id
                            }
                        }
                    }
                })
            }

            return { message: 'Success', status: HttpStatus.CREATED };
        } catch (error) {
            throw new BadRequestException(`Error to create a Relationship, error: ${error.message}`);
        }
    }

    async getUnique(token: TokenVerifiedDto) {
        // const userRole = await this.prismaService.role.findMany({
        //     where: {
        //         users: {
        //             some: {
        //                 email: token.email,
        //             },
        //         },
        //     },
        // });

        // return userRole;
    }

    async getAll() {
        return await this.prismaService.user.findMany()
    }

    async delete(data: UserRoleDto) {
        // try {
        //     const user = await this.prismaService.user.findUnique({
        //         where: { id: data.userId }
        //     });

        //     const role = await this.prismaService.role.findUnique({
        //         where: {
        //             id: Number(data.roleId)
        //         }
        //     })

        //     await this.prismaService.role.update({
        //         where: { id: role.id },
        //         data: {
        //             users: { disconnect: { id: String(user.id) } }
        //         }
        //     });

        //     return { message: "Relationship user-role has been deleted." }
        // } catch (error) {
        //     return { message: error.message }
        // }
    }

}
