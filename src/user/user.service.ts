import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { NewUserDto } from './dto/new-user.dto';
import { UserRoleService } from 'src/user-role/user-role.service';
import { UserRoleDto } from 'src/user-role/dto/userRole.dto';
import { ValidationResult } from 'src/auth/validation-resource-return';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userRoleService: UserRoleService,
    ) { }

    async create(data: NewUserDto): Promise<Object> {
        try {
            const verifyEmail = await this.prismaService.user.findUnique({ where: { email: data.email } });
            if (verifyEmail) throw new HttpException("This email is already in use.", HttpStatus.CONFLICT);

            const verifyUsername = await this.prismaService.user.findUnique({ where: { username: data.username } })
            if (verifyUsername) throw new HttpException("This username is already in use.", HttpStatus.CONFLICT);

            const hashPassword = await bcrypt.hash(data.password, 10);

            const newUser = await this.prismaService.user.create({
                data: {
                    email: data.email,
                    password: hashPassword,
                    username: data.username,
                }, select: {
                    id: true, email: true, Role: true
                }
            });

            if (data.role.length > 0) {
                const userRoleDto: UserRoleDto = {
                    userId: newUser.id,
                    roles: data.role
                }
                await this.userRoleService.create(userRoleDto)
            }

            return newUser;
        } catch (error) {
            throw new HttpException(`Create user error: ${error.message}`, HttpStatus.BAD_REQUEST,)
        }
    }

    async getUser(validationResult: ValidationResult, decodedToken: TokenVerifiedDto) {
        try {
            if (validationResult.owneronly) {

                return await this.prismaService.user.findUnique({
                    where: {
                        id: decodedToken.id,
                    }
                })
            }

            return await this.prismaService.user.findMany({ include: { Role: true } })
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async findByEmail(email: string) {
        return "ok"
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         email: email
        //     }, include: {
        //         roles: true
        //     }
        // })
        // if (!user) throw new NotFoundException();

        // return {
        //     status: HttpStatus.FOUND,
        //     return: user
        // }

    }

    async delete(data: DeleteUserDto, token: TokenVerifiedDto) {
        // try {
        //     const checkUserRole = await this.prisma.user.findUnique({
        //         where: {
        //             email: token.email
        //         }, include: {
        //             roles: true
        //         }
        //     })


        //     // const hasAdminRole = checkUserRole.roles.some(
        //     //     (role) => role.name == 'admin'
        //     // )
        //     const hasAdminRole = ""

        //     const checkUser = await this.prisma.user.findUnique({
        //         where: {
        //             id: data.id
        //         }
        //     })

        //     if (!checkUser) throw new NotFoundException("Don't exists user with this ID.")
        //     console.log(hasAdminRole)
        //     if (!hasAdminRole || data.id != checkUser.id) { throw new HttpException("Don't have permission to delete another user", HttpStatus.FORBIDDEN) }

        //     const deleteUser = await this.prisma.user.delete({
        //         where: {
        //             id: checkUser.id
        //         }
        //     })

        //     return {
        //         message: "User has been deleted.",
        //         status: HttpStatus.ACCEPTED,
        //         deletedUser: deleteUser
        //     }

        // } catch (error) {
        //     throw new ForbiddenException("Can't delete user, please check the ID.");
        // }
    }

}
