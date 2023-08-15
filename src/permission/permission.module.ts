import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PrismaService } from 'src/database/prisma.service';
import { SetupService } from 'src/setup/setup.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRoleMiddleware } from 'src/auth/auth-role.middleware';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PrismaService, AuthGuard, AuthService, JwtService]
})
export class PermissionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRoleMiddleware)
      .forRoutes("/permission");
  }
}
