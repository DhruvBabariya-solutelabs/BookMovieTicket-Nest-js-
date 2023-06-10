import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  NotAcceptableException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from '../dto/login.dto';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { role } from 'src/util/constant.util';
import { User } from 'src/entities/user.entity';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto, user?: User): Promise<User> {
    let userRole = role.USER;
    let users = await this.userService.findAll();
    if (users.length == 0) {
      userRole = role.SUPER_ADMIN;
    } else {
      const superAdmin = await this.userService.findByRole(role.SUPER_ADMIN);
      if (!superAdmin) {
        userRole = role.SUPER_ADMIN;
      }
    }
    if (user) {
      if (user.role === role.SUPER_ADMIN) {
        userRole = role.ADMIN;
      }
    }
    return this.userService.create(createUserDto, userRole);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('email does not exist');
    }
    if (user.status === 0) {
      throw new UnauthorizedException('Deactivated Account by admin');
    }
    const isEqual = await compare(loginDto.password, user.password.trim());
    if (!isEqual) {
      throw new UnauthorizedException('Wrong Password');
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
    if (!token) {
      throw new NotFoundException('Token is not generate');
    }
    return {
      access_token: token,
    };
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    const matchPassword = await compare(
      changePasswordDto.existingPassword,
      user.password.trim(),
    );
    if (!matchPassword) {
      throw new NotAcceptableException('please enter valid Existing PAssword ');
    }
    const hashPassword = await hash(changePasswordDto.newPassword, 10);
    user.password = hashPassword;
    const savedUser = await this.userService.saveUser(user);
    if (savedUser) {
      return 'Password Change successfully';
    } else {
      throw new NotImplementedException('user not updated');
    }
  }
}
