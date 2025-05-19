import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ContractController],
  providers: [ContractService],
  imports: [AuthModule], // Importa el módulo de autenticación aquí
})
export class ContractModule {}
