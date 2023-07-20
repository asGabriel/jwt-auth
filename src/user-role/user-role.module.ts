import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, PrismaService, AuthService]
})
export class UserRoleModule {}
