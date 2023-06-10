import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(10, 10)
  contact: string;
}
