import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { rbac } from 'src/rbac-config';
import { NewUserSetupDto } from './dto/new-user-setup.dto';
import { UserCreatedDto } from './dto/user-created.dto';

@Injectable()
export class SetupService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async createSuperUser(data: NewUserSetupDto, authHeader: string): Promise<UserCreatedDto> {
        const dotenv = process.env.API_KEY
        if (authHeader != dotenv) throw new UnauthorizedException

        const checkSetup = await this.prismaService.role.findUnique({where: {name: 'admin'}})
        if (!checkSetup) throw new BadRequestException("Start role setup first.")

        const hashPassword = await bcrypt.hash(data.password, 10);

        try {
            const newAdminuser = await this.prismaService.user.create({
                data: {
                    email: data.email,
                    password: hashPassword,
                    roles: {
                        connect: {
                            id: checkSetup.id
                        }
                    }
                }, select: {
                    id: true, email: true, createdAt: true
                }
            })

            return newAdminuser
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async rbacSetup(): Promise<void> {
        try {
            const roles = rbac
            await this.prismaService.permission.deleteMany()
            await this.prismaService.role.deleteMany()
            await this.prismaService.resource.deleteMany()

            for (const role of roles) {
                for (const permissions of role.permissions) {
                    for (const resources of permissions.resources) {
                        for (const resPermission of permissions.action) {
                            await this.prismaService.permission.create({
                                data: {
                                    name: resPermission.name,
                                    owneronly: resPermission.owneronly,
                                    resource: {
                                        connectOrCreate: {
                                            create: {
                                                name: resources
                                            }, where: {
                                                name: resources
                                            }
                                        }
                                    },
                                    roles: {
                                        connectOrCreate: {
                                            create: {
                                                name: role.name
                                            },
                                            where: {
                                                name: role.name
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            }
        } catch (error) {
            throw new BadRequestException("Setup has been already executed", error.message)
        }
    }
}
