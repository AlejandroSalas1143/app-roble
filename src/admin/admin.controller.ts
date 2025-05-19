import { Controller, Get, Param, Delete, Patch, UseGuards, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminEmailGuard } from './admin-email.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('admin')
@UseGuards(AdminEmailGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/disable')
  disableUser(
  @Param('id') id: string, 
  @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.disableUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('users/:userId/projects')
  getProjects(@Param('userId') userId: string) {
    return this.adminService.getProjectsByUser(userId);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id') id: string) {
    return this.adminService.deleteProject(id);
  }
}