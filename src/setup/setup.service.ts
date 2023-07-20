import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { rbac } from 'src/rbac-config';
import { NewUserSetupDto } from './dto/new-user-setup.dto';
import { User } from '@prisma/client';

@Injectable()
export class SetupService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async createSuperUser(data: NewUserSetupDto, authHeader: string): Promise<User> {
        const dotenv = process.env.API_KEY
        if (authHeader != dotenv) throw new UnauthorizedException

        const checkSetup = await this.prismaService.role.findFirst()
        if(!checkSetup) throw new BadRequestException("Start role setup first.")

        try {
            const newAdminuser = await this.prismaService.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    roles: {
                        connect: {
                            name: 'admin'
                        }
                    }
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
