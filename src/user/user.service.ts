import {
  Injectable,
  HttpStatus,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { role } from 'src/util/constant.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, userRole: string): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const hashPassword = await hash(user.password, 10);
    user.password = hashPassword;
    user.role = userRole;
    const savedUser = await this.userRepository.save(user);
    if (!savedUser) {
      throw new NotAcceptableException('User Does not save..');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users) {
      throw new NotFoundException('Not Found any User in Db');
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        movieTicket: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Not Found any User in Db');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByRole(role: string): Promise<User> {
    return this.userRepository.findOne({ where: { role } });
  }

  async update(id: number, attrs: Partial<User>): Promise<String> {
    const user = await this.findOne(id);
    if (user.role == role.USER) {
      throw new NotAcceptableException('Admin can not update user');
    }
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    Object.assign(user, attrs);
    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) {
      throw new NotAcceptableException('User Does not Update..');
    }
    return 'User Updated Succesfully';
  }

  async saveUser(user: User): Promise<boolean> {
    const savedUser = await this.userRepository.save(user);
    if (!savedUser) {
      return false;
    }
    return true;
  }

  async remove(id: number): Promise<String> {
    const user = await this.findOne(id);
    if (user.role == role.USER) {
      throw new NotAcceptableException('Admin can not Remove user');
    }
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const removedUser = await this.userRepository.remove(user);
    if (!removedUser) {
      throw new NotAcceptableException('User Not removed');
    }
    return 'User Removed Successful';
  }
}
