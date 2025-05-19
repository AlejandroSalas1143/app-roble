import { Injectable } from '@nestjs/common';
import { PrismaClient as UserClient } from '../../prisma/generated/tenant';
import { PrismaClient as AppClient } from '../../prisma/generated/main';

@Injectable()
export class MultiPrismaService {
  userClient = new UserClient();
  appClient = new AppClient();
}