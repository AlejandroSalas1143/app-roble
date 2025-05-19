import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MultiPrismaService } from './multiPrisma.service';
import { DbAdminService } from './db-admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, MultiPrismaService, DbAdminService],
})
export class AdminModule {}
