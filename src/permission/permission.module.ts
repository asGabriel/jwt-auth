import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';
import { SetupService } from 'src/setup/setup.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PrismaService]
})
export class PermissionModule {}
