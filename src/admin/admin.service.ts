import { Injectable } from '@nestjs/common';
import { MultiPrismaService } from './multiPrisma.service';
import { DbAdminService } from './db-admin.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: MultiPrismaService,
    private readonly dbAdminService: DbAdminService,
  ) { }

  async getAllUsers() {
    return this.prisma.userClient.user.findMany({
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });
  }

  async disableUser(id: string, updateUserDto: UpdateUserDto) {
    const { isVerified } = updateUserDto;

    return this.prisma.userClient.user.update({
      where: { id },
      data: { isVerified: isVerified },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.userClient.user.delete({ where: { id } });
  }

  async getProjectsByUser(userId: string) {
    console.log('userId', userId);
    return this.prisma.appClient.contract.findMany({ where: { userId } });
  }

  async deleteProject(id: string) {
    const project = await this.prisma.appClient.contract.findUnique({
      where: { id },
    });
    if (!project) {
      throw new Error('Project not found');
    }
    await this.dbAdminService.dropDatabase(project.appId);

    await this.prisma.appClient.contract.delete({ where: { id } });

    return { message: 'Project deleted successfully' };

  }
}