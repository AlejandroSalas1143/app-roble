import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';
import { Client } from 'pg';
import { PrismaClient as MainPrisma } from '../../prisma/generated/main';
import { BadRequestException } from '@nestjs/common';



@Injectable()
export class ContractService {
  private mainPrisma = new MainPrisma();
  private readonly MAX_PROJECTS = 3;

  async create(createContractDto: CreateContractDto, { userId, userEmail }: { userId: string; userEmail: string }) {

    const userContracts = await this.mainPrisma.contract.count({
      where: { userId },
    });

    if (userContracts >= this.MAX_PROJECTS) {
      throw new BadRequestException('You have reached the maximum number of allowed projects');
    }

    const { appName } = createContractDto;
    const key = randomBytes(5).toString('hex');
    const dbName = `contract_${appName.toLowerCase()}_${key}`;

    try {
      await this.createDatabase(dbName);
      this.runMigrations(dbName);
    } catch (error) {
      throw new InternalServerErrorException('Error setting up tenant database');
    }

    await this.mainPrisma.contract.create({
      data: {
        userId: userId,
        userEmail: userEmail,
        key,
        appName: createContractDto.appName,
        appId: dbName,
      },
    });

    return { message: 'App creada exitosamente', dbName };
  }

  async getContractsByUserId(id: string) {
    return this.mainPrisma.contract.findMany({
      where: { userId: id },
      select: {
        id: true,
        key: true,
        appName: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }

  private async createDatabase(dbName: string) {
    const client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres',
    });

    await client.connect();
    await client.query(`CREATE DATABASE "${dbName}"`);
    await client.end();
  }

  private runMigrations(dbName: string) {
    execSync(`npx prisma migrate deploy --schema=./prisma/tenant/schema.prisma`, {
      env: {
        ...process.env,
        TENANT_DATABASE_URL: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`,
      },
    });
  }
}
