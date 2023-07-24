import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { NewUserDto } from './dto/new-user.dto';
import * as bcrypt from "bcrypt"
import { DeleteUserDto } from './dto/delete-user.dto';
import { TokenVerifiedDto } from 'src/auth/dto/token-verified.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(data: NewUserDto) {
        const verifyEmail = await this.prisma.user.findFirst({ where: { email: data.email } });
        if (verifyEmail) throw new HttpException("This email is already in use.", HttpStatus.CONFLICT);

        const hashPassword = await bcrypt.hash(data.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashPassword,
            }, select: {
                id: true, email: true, roles: true
            }
        });

        return newUser;
    }

    async getUser() {
        try {
            const user = await this.prisma.user.findMany({ include: { roles: { include: { permissions: true } } } });

            const usersWithoutPassword = user.map(user => {
                const { password, ...userWithoutPassword } = { ...user }
                return userWithoutPassword;
            })

            return usersWithoutPassword;
        } catch (error) {
            throw new HttpException("An error occurred while getting user(s).", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }, include: {
                roles: true
            }
        })
        if (!user) throw new NotFoundException();

        return {
            status: HttpStatus.FOUND,
            return: user
        }

    }

    async delete(data: DeleteUserDto, token: TokenVerifiedDto) {
        try {
            const checkUserRole = await this.prisma.user.findUnique({
                where: {
                    email: token.email
                }, include: {
                    roles: true
                }
            })


            // const hasAdminRole = checkUserRole.roles.some(
            //     (role) => role.name == 'admin'
            // )
            const hasAdminRole = ""

            const checkUser = await this.prisma.user.findUnique({
                where: {
                    id: data.id
                }
            })

            if (!checkUser) throw new NotFoundException("Don't exists user with this ID.")
            console.log(hasAdminRole)
            if (!hasAdminRole || data.id != checkUser.id) { throw new HttpException("Don't have permission to delete another user", HttpStatus.FORBIDDEN) }

            const deleteUser = await this.prisma.user.delete({
                where: {
                    id: checkUser.id
                }
            })

            return {
                message: "User has been deleted.",
                status: HttpStatus.ACCEPTED,
                deletedUser: deleteUser
            }

        } catch (error) {
            throw new ForbiddenException("Can't delete user, please check the ID.");
        }
    }

}
