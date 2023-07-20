import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthRoleMiddleware } from 'src/auth/auth-role.middleware';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService, AuthService]
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthRoleMiddleware)
      .forRoutes('comment');
  }
}
