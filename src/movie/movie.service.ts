import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';
import { BookTicketDto } from 'src/dto/book-ticket.dto';
import { Shows } from 'src/entities/shows.entites';
import { seatType } from 'src/util/constant.util';
import { MovieTicket } from 'src/entities/movie-ticket.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(MovieTicket)
    private readonly movieTicketRepo: Repository<MovieTicket>,
  ) {}

  async create(createMovieDto: CreateMovieDto, user: User): Promise<Movie> {
    const date = createMovieDto.releaseDate;
    const releaseDate = new Date(date);
    createMovieDto.releaseDate = releaseDate;
    const movie = this.movieRepo.create(createMovieDto);
    movie.createdby = user;
    const savedMovie = await this.movieRepo.save(movie);
    if (!savedMovie) {
      throw new NotAcceptableException('Movie does not saved Successfully');
    }
    return savedMovie;
  }

  async findAll(): Promise<Movie[]> {
    const movies = await this.movieRepo.find({
      relations: {
        shows: true,
      },
    });
    if (movies.length === 0) {
      throw new NotFoundException('Movie is Not Found');
    }
    return movies;
  }

  async getMovieByTitle(title: string) {
    const movie = await this.movieRepo.findOne({
      where: { title },
      relations: { shows: true },
    });
    if (!movie) {
      throw new NotFoundException('Movie is Not Found');
    }
    return movie;
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: {
        shows: true,
        createdby: true,
      },
    });
    if (!movie) {
      throw new NotFoundException('Movie Does not found');
    }
    return movie;
  }

  async update(id: number, attrs: Partial<Movie>): Promise<Movie> {
    const movie = await this.findOne(id);
    Object.assign(movie, attrs);
    const updatedMovie = await this.movieRepo.save(movie);
    if (!updatedMovie) {
      throw new NotAcceptableException('Movie Does not Update..');
    }
    return updatedMovie;
  }

  async remove(id: number): Promise<{ message: string; movie: Movie }> {
    const movie = await this.findOne(id);
    const removedMovie = await this.movieRepo.remove(movie);
    if (!removedMovie) {
      throw new NotFoundException('Movie does not Found');
    }
    return {
      message: 'Movie Deleted Successfully',
      movie: removedMovie,
    };
  }

  async bookMovieTicket(
    movieId: number,
    bookTicketDto: BookTicketDto,
    user: User,
  ): Promise<MovieTicket> {
    const showTime = new Date(bookTicketDto.showTime);

    const movie = await this.findOne(movieId);
    const releaseDate = movie.releaseDate;
    const currentDate = new Date();
    if (currentDate.getTime() < releaseDate.getTime()) {
      throw new UnprocessableEntityException(
        'can not booked ticket of upcomming movies',
      );
    }
    const currentTime = Date.now();
    if (showTime.getTime() < currentTime) {
      throw new UnprocessableEntityException('show time is not available');
    }
    const shows = movie.shows;
    let show: Shows;
    let index: number;
    let price: number;
    for (let i = 0; i < shows.length; i++) {
      if (showTime.toString() == shows[i].time.toString()) {
        show = shows[i];
        index = i;
      }
    }
    if (!show) {
      throw new UnprocessableEntityException('show is not available');
    } else {
      if (show.availableSeats === 0) {
        throw new UnprocessableEntityException('seat is not available');
      }
      if (bookTicketDto.seat === seatType.gold) {
        if (show.goldSeat === 0) {
          throw new UnprocessableEntityException('Gold seat is not available');
        }
        movie.shows[index].goldSeat -= 1;
        price = movie.shows[index].goldPrice;
      } else if (bookTicketDto.seat === seatType.silver) {
        if (show.silverSeat === 0) {
          throw new UnprocessableEntityException(
            'Silver seat is not available',
          );
        }
        movie.shows[index].silverSeat -= 1;
        price = movie.shows[index].silverPrice;
      } else {
        if (show.platinumSeat === 0) {
          throw new UnprocessableEntityException(
            'Platinum seat is not available',
          );
        }
        movie.shows[index].platinumSeat -= 1;
        price = movie.shows[index].platinumPrice;
      }

      movie.shows[index].availableSeats -= 1;
      const updatedMovie = await this.movieRepo.save(movie);
      if (updatedMovie) {
        const movieTicket = this.movieTicketRepo.create(bookTicketDto);
        movieTicket.price = price;
        movieTicket.movieTitle = movie.title;
        movieTicket.user = user;
        const ticket = await this.movieTicketRepo.save(movieTicket);
        if (!ticket) {
          throw new NotAcceptableException('Ticked is not Book right now');
        }
        return ticket;
      }
    }
  }

  async cancelMovieTicket(
    id: number,
    user: User,
  ): Promise<{ message: string }> {
    const ticket = await this.movieTicketRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    const seat = ticket.seat;
    const showTime = ticket.showTime;
    let index: number;
    const movie = await this.getMovieByTitle(ticket.movieTitle);
    const shows = movie.shows;
    for (let i = 0; i < shows.length; i++) {
      if (showTime.toString() == shows[i].time.toString()) {
        index = i;
      }
    }
    movie.shows[index].availableSeats += 1;
    if (seat == seatType.gold) {
      movie.shows[index].goldSeat += 1;
    } else if (seat == seatType.silver) {
      movie.shows[index].silverSeat += 1;
    } else {
      movie.shows[index].platinumSeat += 1;
    }

    const movies = await this.movieRepo.save(movie);
    if (!movies) {
      throw new NotFoundException('shows does not updated try aganin');
    }
    const tickets = await this.movieTicketRepo.remove(ticket);
    if (!tickets) {
      throw new NotFoundException('ticket does not cancel');
    }
    return {
      message: 'ticket cancel successfully',
    };
  }

  async findUpcommingMovies(): Promise<Movie[]> {
    const currentTime = new Date();
    console.log(currentTime);
    const movies = await this.movieRepo
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.shows', 'shows')
      .where('movie.releaseDate > :currentTime', { currentTime })
      .orderBy('movie.releaseDate', 'ASC')
      .getMany();

    if (!movies) {
      throw new NotFoundException('Not Upcomming movies are there');
    }
    return movies;
  }

  async currentMovieShortByShows(): Promise<Movie[]> {
    const movies = await this.movieRepo
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.shows', 'shows')
      .where('movie.releaseDate < :currentTime', { currentTime: new Date() })
      .andWhere('shows.time >= :currentTime', { currentTime: new Date() })
      .orderBy('shows.time', 'ASC')
      .getMany();
    if (!movies) {
      throw new NotFoundException('Not Upcomming movies are there');
    }
    return movies;
  }
}
