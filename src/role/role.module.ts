import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RoleService, PrismaService, AuthGuard, AuthService, JwtService],
  controllers: [RoleController]
})
export class RoleModule {}
