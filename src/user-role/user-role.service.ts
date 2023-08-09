import { ValidationResult } from 'src/auth/validation-resource-return';
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { UserRoleDto } from './dto/userRole.dto';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';
import { Role, User } from '@prisma/client';
import { decode } from 'punycode';

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

    async delete(data: UserRoleDto, decodedToken: TokenVerifiedDto, validationResult: ValidationResult) {
        try {
            let user = null
            console.log(validationResult)
            if (validationResult.owneronly) {
                user = await this.prismaService.user.findUnique({
                    where: {
                        id: decodedToken.id
                    }, include: {
                        Role: true
                    }
                })
            } else {
                user = await this.prismaService.user.findUnique({
                    where: {
                        id: data.userId
                    }, select: {
                        id: true,
                        Role: {
                            select: {
                                id: true, name: true
                            }
                        }
                    }
                }
                )
            }

            user.Role.forEach(async element => {
                const roleId = element.id
                console.log(` roleId: ${roleId} userId: ${user.id}`)
                // await this.prismaService.role.update({
                //     where: {
                //         id: roleId
                //     }, data: {
                //         User: {
                //             disconnect: {
                //                 id: user.id
                //             }
                //         }
                //     }
                // })
                console.log("desconectado", roleId)
            });

            return user;

        } catch (error) {
            return { message: error.message }
        }
    }

}
