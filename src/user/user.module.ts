import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { AuthRoleMiddleware } from 'src/auth/auth-role.middleware';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService, PrismaService, AuthService],
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
