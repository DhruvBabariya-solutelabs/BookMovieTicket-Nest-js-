import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@ApiTags('Authantication')
@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(201)
  @ApiBearerAuth('access-token')
  @UseGuards(SuperAdminGuard)
  @UseGuards(JwtGuard)
  @Post('super-admin/admin-signup')
  createAdmin(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user?: User,
  ): Promise<User> {
    return this.authService.signup(createUserDto, user);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @HttpCode(200)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('change-password/:id')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    return this.authService.changePassword(+id, changePasswordDto);
  }
}
