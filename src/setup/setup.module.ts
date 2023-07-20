import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { PrismaService } from 'src/database-sqlite/prisma.service';

@Module({
  controllers: [SetupController],
  providers: [SetupService, PrismaService]
})
export class SetupModule {}
