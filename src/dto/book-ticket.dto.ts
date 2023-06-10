import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { seatType } from 'src/util/constant.util';

export class BookTicketDto {
  @ApiProperty()
  @IsEnum(seatType)
  seat: string;

  @ApiProperty()
  @IsString()
  showTime: string;
}
