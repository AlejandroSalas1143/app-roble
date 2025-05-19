// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller(':dbName/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post(':dbName')
  create(
    @Param('dbName') dbName: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(dbName, createUserDto);
  }

  @Get(':dbName')
  findAll(@Param('dbName') dbName: string) {
    return this.userService.findAll(dbName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':dbName/:id')
  update(
    @Param('dbName') dbName: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.disable(dbName, id, updateUserDto);
  }

  @Delete(':dbName/:id')
  remove(@Param('dbName') dbName: string, @Param('id') id: string) {
    return this.userService.remove(dbName, id);
  }
}
