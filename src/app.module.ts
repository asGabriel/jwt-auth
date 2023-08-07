import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PermissionModule } from './permission/permission.module';
import { PostModule } from './post/post.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserModule } from './user/user.module';
import { SetupModule } from './setup/setup.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [UserModule, AuthModule, PostModule, CommentModule, UserRoleModule, RolePermissionModule, PermissionModule, SetupModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
