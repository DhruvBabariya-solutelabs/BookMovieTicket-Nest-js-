import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateShowDto } from 'src/dto/create-show.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { UpdateShowDto } from 'src/dto/update-show.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { Shows } from 'src/entities/shows.entites';

@ApiTags('Shows')
@UseGuards(JwtGuard, AdminGuard)
@ApiBearerAuth('access-token')
@Controller('admin')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @HttpCode(201)
  @Post('shows/create')
  create(
    @Body() createShowDto: CreateShowDto,
    @GetUser() user: User,
  ): Promise<Shows> {
    return this.showService.create(createShowDto, user);
  }

  @HttpCode(200)
  @Get('shows')
  findAll(): Promise<Shows[]> {
    return this.showService.findAll();
  }

  @HttpCode(200)
  @Get('show/:id')
  findOne(@Param('id') id: string): Promise<Shows> {
    return this.showService.findOne(+id);
  }

  @Patch('show/:id')
  update(
    @Param('id') id: string,
    @Body() updateShowDto: UpdateShowDto,
  ): Promise<Shows> {
    return this.showService.update(+id, updateShowDto);
  }

  @Delete('show/:id')
  remove(@Param('id') id: string): Promise<Shows> {
    return this.showService.remove(+id);
  }
}
