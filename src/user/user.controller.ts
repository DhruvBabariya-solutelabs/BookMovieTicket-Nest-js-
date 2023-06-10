import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';
import { User } from 'src/entities/user.entity';

@UseGuards(JwtGuard)
@ApiTags('User-Api')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @HttpCode(204)
  @UseGuards(SuperAdminGuard)
  @Patch('super-admin/update-admin/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<String> {
    return this.userService.update(+id, updateUserDto);
  }

  @HttpCode(204)
  @UseGuards(SuperAdminGuard)
  @Delete('super-admin/delete-admin/:id')
  remove(@Param('id') id: string): Promise<String> {
    return this.userService.remove(+id);
  }
}
