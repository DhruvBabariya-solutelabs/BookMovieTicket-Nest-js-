import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateShowDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  time: Date;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  @Max(1000)
  @IsNotEmpty()
  goldSeat: number;

  @ApiProperty()
  @IsNumber()
  @Min(50)
  @Max(10000)
  @IsNotEmpty()
  goldPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  @Max(1000)
  @IsNotEmpty()
  silverSeat: number;

  @ApiProperty()
  @IsNumber()
  @Min(50)
  @Max(10000)
  @IsNotEmpty()
  silverPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  @Max(1000)
  @IsNotEmpty()
  platinumSeat: number;

  @ApiProperty()
  @IsNumber()
  @Min(50)
  @Max(10000)
  @IsNotEmpty()
  platinumPrice: number;
}
