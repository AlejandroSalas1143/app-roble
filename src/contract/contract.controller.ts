import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contract')
@UseGuards(JwtAuthGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}
  @Post()
  async create(@Body() CreateContractDto: CreateContractDto, @Request() req) {
    const user = req.user;
    if (user.dbName !== process.env.APP_PRINCIPAL) {
      throw new ForbiddenException('No tienes acceso a esta base de datos');
    } 
    return this.contractService.create(CreateContractDto, { userId: user.sub, userEmail: user.email });
  }

  @Get(':userId')
  async getContractsByUserId(@Param('userId') userId: string) {
    return this.contractService.getContractsByUserId(userId);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(+id);
  }
}
