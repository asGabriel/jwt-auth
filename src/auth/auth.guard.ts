import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt-secret';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private reflector: Reflector,
    private prismaService: PrismaService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
    const checkInvalidToken = await this.prismaService.invalidToken.findFirst({ where: { invalidtoken: token } })
    if (checkInvalidToken) throw new BadRequestException("Invalid token.")

      const payload = await this.jwt.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      request['user'] = payload;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}