import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(+id);
  }

  @Get(':id/avatar')
  getAvatar(@Param('id') id: string): Promise<string> {
    return this.usersService.getAvatarByUserId(+id);
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    await this.usersService.deleteAvatarByUserId(+id);
    return { message: 'Avatar deleted successfully.' };
  }
}
