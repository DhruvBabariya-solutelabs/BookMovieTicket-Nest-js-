import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { BookTicketDto } from 'src/dto/book-ticket.dto';
import { Movie } from 'src/entities/movie.entity';
import { MovieTicket } from 'src/entities/movie-ticket.entity';

@ApiTags('Movie-Api')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @HttpCode(201)
  @UseGuards(AdminGuard)
  @Post('admin/create')
  create(
    @Body() createMovieDto: CreateMovieDto,
    @GetUser() user: User,
  ): Promise<Movie> {
    return this.movieService.create(createMovieDto, user);
  }

  @HttpCode(200)
  @Get('upcomming-movies')
  findAllUpcomminMovies(): Promise<Movie[]> {
    return this.movieService.findUpcommingMovies();
  }

  @HttpCode(200)
  @Get('current-movie/shor-by-shows')
  currentMovieShortByShow(): Promise<Movie[]> {
    return this.movieService.currentMovieShortByShows();
  }

  @HttpCode(200)
  @Get()
  findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Movie> {
    return this.movieService.findOne(+id);
  }

  @HttpCode(200)
  @UseGuards(AdminGuard)
  @Patch('admin/:id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    if (updateMovieDto.releaseDate) {
      const date = new Date(updateMovieDto.releaseDate);
      updateMovieDto.releaseDate = date;
    }
    return this.movieService.update(+id, updateMovieDto);
  }

  @HttpCode(204)
  @UseGuards(AdminGuard)
  @Delete('admin/:id')
  remove(@Param('id') id: string): Promise<{ message: string; movie: Movie }> {
    return this.movieService.remove(+id);
  }

  @HttpCode(200)
  @Post('book-ticket/:movieId')
  bookTicket(
    @Param('movieId') movieId: string,
    @Body() bookTicketDto: BookTicketDto,
    @GetUser() user: User,
  ): Promise<MovieTicket> {
    return this.movieService.bookMovieTicket(+movieId, bookTicketDto, user);
  }

  @HttpCode(204)
  @Post('cancel-ticket/:ticketId')
  cancelTicket(
    @Param('ticketId') ticketId: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.movieService.cancelMovieTicket(+ticketId, user);
  }
}
