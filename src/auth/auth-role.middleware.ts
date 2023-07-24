import { BadRequestException, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { ValidationResult } from './validation-resource-return';

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
    const resourceRequested = await this.prismaService.resource.findUnique({ where: { name: resource } })
    if (!resourceRequested) throw new NotFoundException("Resource not found");

    switch (httpMethod) {
      case 'GET':
        const hasPermissionToGet = decodedToken.roles.find(
          (item) => item.resource === resourceRequested.name && item.permission === httpMethod.toLowerCase()
        );
        if (!hasPermissionToGet) throw new UnauthorizedException("User does not have permission.");
        const resultGet = new ValidationResult(hasPermissionToGet.permission, hasPermissionToGet.resource, hasPermissionToGet.owneronly)
        req['context'] = { resultGet };
        next();
        break;

      case 'POST':
        const hasPermissionToPost = decodedToken.roles.find(
          (item) => item.resource === resourceRequested.name && item.permission === httpMethod.toLowerCase()
        );
        if (!hasPermissionToPost) throw new UnauthorizedException("User does not have permission.");
        const resultPost = new ValidationResult(hasPermissionToPost.permission, hasPermissionToPost.resource, hasPermissionToPost.owneronly)
        req['context'] = { resultPost };
        next();
        break;

      case 'PUT':
        const hasPermissionToUpdate = decodedToken.roles.find(
          (item) => item.resource === resourceRequested.name && item.permission === httpMethod.toLowerCase()
        );

        if (!hasPermissionToUpdate) throw new UnauthorizedException("User does not have permission.");
        const resultPut = new ValidationResult(hasPermissionToUpdate.permission, hasPermissionToUpdate.resource, hasPermissionToUpdate.owneronly)
        req['context'] = { resultPut };
        next();
        break;
        
      case 'DELETE':
        const hasPermissionToDelete = decodedToken.roles.find(
          (item) => item.resource === resourceRequested.name && item.permission === httpMethod.toLowerCase()
        );

        if (!hasPermissionToDelete) throw new UnauthorizedException("User does not have permission.");
        const resultDelete = new ValidationResult(hasPermissionToDelete.permission, hasPermissionToDelete.resource, hasPermissionToDelete.owneronly)
        req['context'] = { resultDelete };
        next();
        break;
      default:
        throw new UnauthorizedException();
    }
  }
}
