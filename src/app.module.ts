import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PermissionModule } from './permission/permission.module';
import { PostModule } from './post/post.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserModule } from './user/user.module';
import { SetupModule } from './setup/setup.module';
import { RoleModule } from './role/role.module';
import { AuthRoleMiddleware } from './auth/auth-role.middleware';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [UserModule, AuthModule, PostModule, CommentModule, UserRoleModule, RolePermissionModule, PermissionModule, SetupModule, RoleModule],
  controllers: [],
  providers: [AuthService, JwtService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRoleMiddleware)
      .forRoutes("/permission", "user-role");
  }
}
