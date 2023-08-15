import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthRoleMiddleware } from 'src/auth/auth-role.middleware';
import { AuthService } from 'src/auth/auth.service';
import { UserRoleService } from 'src/user-role/user-role.service';

@Module({
  providers: [UserService, PrismaService, AuthService, UserRoleService],
  controllers: [UserController]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRoleMiddleware)
      .exclude({method: RequestMethod.POST, path: 'user/new'})
      .forRoutes('user');
  }
}
