import { Module } from '@nestjs/common';
import { ContractModule } from './contract/contract.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ContractModule, UserModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
