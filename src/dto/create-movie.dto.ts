import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  releaseDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  casts: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  directors: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  choreographers: string[];
}
