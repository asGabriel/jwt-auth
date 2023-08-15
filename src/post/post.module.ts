import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRoleMiddleware } from 'src/auth/auth-role.middleware';

@Module({
  providers: [PostService, PrismaService, AuthService, AuthGuard],
  controllers: [PostController]
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRoleMiddleware)
      .forRoutes('post');
  }
}
