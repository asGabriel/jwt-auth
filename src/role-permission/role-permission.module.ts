import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { PrismaService } from 'src/database-sqlite/prisma.service';

@Module({
  providers: [RolePermissionService, PrismaService],
  controllers: [RolePermissionController]
})
export class RolePermissionModule {}
