import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/database/prisma.service';
import { ValidationResult } from './validation-resource-return';
import { TokenVerifiedDto } from './dto/token-verified.dto';

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
    // console.log(httpMethod)
    // console.log(resourceRequested)
    // console.log(decodedToken)
    const validationResult: boolean = await this.validatePermission(httpMethod, resourceRequested.id, decodedToken)
    console.log(` validation res: ${validationResult}`)
    if (!validationResult) throw new UnauthorizedException("User does not have permission")

    req['context'] = { validation: validationResult };
    console.log(req["context"]);
    next();
  }

  async validatePermission(httpMethod: string, resourceRequested: number, decodedToken: TokenVerifiedDto): Promise<boolean> {
    try {
      const permissionsArr = [];
      for (const role of decodedToken.roles) {
        const permission = await this.prismaService.permission.findFirst({
          where: {
            name: httpMethod.toLowerCase(),
            resourceId: resourceRequested,
            roles: {
              some: { name: role.name },
            }
          }
        });
        permissionsArr.push(permission);
      }
      
      if (permissionsArr.some(permission => permission !== null)) {
        return true;
      }
      
      return false;
    } catch (error) {
      throw new UnauthorizedException("User does not have permission (validation)", error.message);
    }
  }
}
