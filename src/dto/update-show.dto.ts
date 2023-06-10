import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShowDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  time: Date;
}
