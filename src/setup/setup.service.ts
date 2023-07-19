import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';

@Injectable()
export class SetupService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async rbacSetup(): Promise<void> {

        const roles = [
            {
                name: 'admin',
                permissions: [
                    {
                        resources: ['posts', 'comments', 'users'],
                        permissions: [
                            {
                                name: "create",
                                owneronly: false
                            },
                            {
                                name: "read",
                                owneronly: false
                            },
                            {
                                name: "update",
                                owneronly: false
                            },
                            {
                                name: "delete",
                                owneronly: false
                            },

                        ]
                    }
                ],
            },
            {
                name: "user",
                permissions: [
                    {
                        resources: ['posts', 'comments'],
                        permissions: [
                            {
                                name: 'create',
                                owneronly: true
                            },
                            {
                                name: 'read',
                                owneronly: true
                            },
                            {
                                name: 'update',
                                owneronly: true
                            },
                            {
                                name: 'delete',
                                owneronly: true
                            }
                        ]
                    }
                ]
            }
        ]

        for (const role of roles) {
            for (const permissions of role.permissions) {
                for (const resources of permissions.resources) {
                    for (const resPermission of permissions.permissions) {
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

    }

}
