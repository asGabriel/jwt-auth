import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { RolePermissionDto } from './dto/role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: RolePermissionDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: data.userId,
        },
        include: {
          roles: true,
        },
      });
      if (user.roles) throw new BadRequestException("User already has an role.")

      const permission = await this.prismaService.permission.findMany({
        where: {
          id: {
            in: data.permissionId
          }
        }
      })

      // for (const roleId of roleIds) {
      //   await this.prismaService.permission.update({
      //     where: {
      //       id: permission.id
      //     },
      //     data: {
      //       roles: {
      //         connect: { id: roleId }
      //       }
      //     }
      //   });
      // }

      return permission;

    } catch (error) {
      throw new NotFoundException('Error to create user-role relationship.');
    }
  }

  // async delete(data: RolePermissionDto) {
  //   try {
  //     const user = await this.prismaService.user.findUnique({
  //       where: {
  //         id: data.userId,
  //       },
  //       include: {
  //         roles: true,
  //       },
  //     });

  //     const roleIds = user.roles.map((role) => role.id);

  //     const permission = await this.prismaService.permission.findUnique({
  //       where: {
  //         id: data.permissionId
  //       }
  //     })

  //     for (const roleId of roleIds) {
  //       await this.prismaService.permission.update({
  //         where: {
  //           id: permission.id
  //         },
  //         data: {
  //           roles: {
  //             disconnect: { id: roleId }
  //           }
  //         }
  //       });
  //     }

  //     return { message: 'Relationship role-permission sucessfully deleted.' };
  //   } catch (error) {
  //     throw new NotFoundException('Error to create user-role relationship.');
  //   }
  // }

  // async getOne(userId: string) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       id: userId
  //     }, include: {
  //       roles: {
  //         include: {
  //           permissions: true
  //         }
  //       }
  //     }
  //   })

  //   if (!user) throw new NotFoundException("User not found.")

  //   const permissions = user.roles.flatMap((role) => role.permissions.flatMap((permission) => {
  //     return {
  //       permission: permission.name,
  //       resource: permission.resourceId
  //     }
  //   }));

  //   return permissions;
  // }

}
