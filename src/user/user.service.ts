import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClient as TenantClient } from '../../prisma/generated/tenant';

@Injectable()
export class UserService {
  private clients: Record<string, TenantClient> = {};
  getClient(dbName: string): TenantClient {
    if (!this.clients[dbName]) {
      const url = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`;
      this.clients[dbName] = new TenantClient({
        datasources: { tenantDb: { url } }
      });
    }
    return this.clients[dbName];
  }

  async create(dbName: string, createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    const prisma = this.getClient(dbName);

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        isVerified: true
      }
    });

    return { message: 'Usuario registrado.' };
  }

  async findAll(dbName: string) {
    const prisma = this.getClient(dbName);
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });
    return users
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async disable(dbName: string, id: string, updateUserDto: UpdateUserDto) {
    const { isVerified } = updateUserDto;
    const prisma = this.getClient(dbName);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    await prisma.user.update({
      where: { id },
      data: { isVerified },
    });

    return { message: 'Usuario actualizado exitosamente' };
  }

  async remove(dbName: string, id: string) {
    const prisma = this.getClient(dbName);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    await prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado exitosamente' };
  }
}
