import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { ValidationResult } from './validation-resource-return';

@Injectable()
export class AuthRoleMiddleware implements NestMiddleware {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log("auth-role middleware")

    const httpMethod = req.method;
    const headerAuthorization = req.headers.authorization;
    const urlParts = req.originalUrl.split('/');
    const resource = urlParts[1];
    if (!resource) throw new BadRequestException();
    if (!headerAuthorization)
      throw new UnauthorizedException('Token not found');

    const decodedToken = await this.authService.verifyToken(
      headerAuthorization,
    );
    const resourceRequested = await this.prismaService.resource.findUnique({
      where: { name: resource },
    });
    if (!resourceRequested) throw new NotFoundException('Resource not found');

    switch (httpMethod) {
      case 'GET':
        console.log("midd ware get")
        const getValidation: ValidationResult = await this.validatePermission(httpMethod, resourceRequested, decodedToken)
        if (!getValidation)
          throw new UnauthorizedException('User does not have permission');
        req['context'] = { validation: getValidation };
        console.log(req["context"]);
        next();
        break;

      case 'POST':
        const postValidation: ValidationResult = await this.validatePermission(httpMethod, resourceRequested, decodedToken)
        if (!postValidation)
          throw new UnauthorizedException('User does not have permission.');
        req['context'] = { postValidation };
        next();
        break;

      case 'PUT':
        const putValidation: ValidationResult = await this.validatePermission(httpMethod, resourceRequested, decodedToken)
        if (!putValidation)
          throw new UnauthorizedException('User does not have permission.');
        req['context'] = { putValidation };
        next();
        break;

      case 'DELETE':
        const deleteValidation: ValidationResult = await this.validatePermission(httpMethod, resourceRequested, decodedToken)
        if (!deleteValidation)
          throw new UnauthorizedException('User does not have permission.');
        req['context'] = { deleteValidation };
        next();
        break;
      default:
        throw new UnauthorizedException();
    }
  }

  async validatePermission(httpMethod, resourceRequested, decodedToken): Promise<ValidationResult> {
    const validation = await this.prismaService.permission.findFirst({
      where: {
        name: httpMethod.toLowerCase(),
        resourceId: resourceRequested.id,
        roles: {
          some: {
            name: decodedToken.roles.map((role) => role.name).join()
          }
        }
      }, select: {
        name: true, owneronly: true, resourceId: true
      }
    })

    const validationResult: ValidationResult = {
      permission: validation.name,
      resourceId: validation.resourceId,
      owneronly: validation.owneronly
    }

    return validationResult;
  }

}
