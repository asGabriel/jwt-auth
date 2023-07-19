import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';

@Injectable()
export class AuthRoleMiddleware implements NestMiddleware {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const httpMethod = req.method;
    const headerAuthorization = req.headers.authorization;
    const urlParts = req.originalUrl.split('/')
    const resource = urlParts[1];
    if (!resource) throw new BadRequestException();

    const decodedToken = await this.authService.verifyToken(headerAuthorization);

    const user = await this.prismaService.user.findUnique({
      where: {
        email: decodedToken.email
      }, include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })

    console.log(user)
    const permissions = []

    // const permissions = user.roles.flatMap((role) => role.permissions.flatMap((permission) => {
    //   return {
    //     permission: permission.name,
    //     resource: permission.resourceId
    //   }
    // }));

    const resourceNumber = await this.prismaService.resource.findUnique({ where: { name: resource } })

    switch (httpMethod) {
      case 'GET':
        const hasPermissionToGet = permissions.some(
          (item) => item.resource === resourceNumber.id && item.permission === httpMethod.toLowerCase()
        );

        if (!hasPermissionToGet) throw new UnauthorizedException("User does not have permission.");
        next();
        break;
      case 'POST':
        const hasPermissionToPost = permissions.some(
          (item) => item.resource === resourceNumber.id && item.permission === httpMethod.toLowerCase()
        );

        if (!hasPermissionToPost) throw new UnauthorizedException("User does not have permission.");
        next();
        break;
      case 'PUT':
        const hasPermissionToUpdate = permissions.some(
          (item) => item.resource === resourceNumber.id && item.permission === httpMethod.toLowerCase()
        );

        if (!hasPermissionToUpdate) throw new UnauthorizedException("User does not have permission.");
        next();
        break;
      case 'DELETE':
        const hasPermissionToDelete = permissions.some(
          (item) => item.resource === resourceNumber.id && item.permission === httpMethod.toLowerCase()
        );

        if (!hasPermissionToDelete) throw new UnauthorizedException("User does not have permission.");
        next();
        break;
      default:
        throw new UnauthorizedException();
    }
  }
}
