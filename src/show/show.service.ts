import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShowDto } from 'src/dto/create-show.dto';
import { UpdateShowDto } from 'src/dto/update-show.dto';
import { Shows } from 'src/entities/shows.entites';
import { User } from 'src/entities/user.entity';
import { MovieService } from 'src/movie/movie.service';
import { Repository } from 'typeorm';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Shows) private readonly showsRepo: Repository<Shows>,
    private readonly movieService: MovieService,
  ) {}

  async create(createShowDto: CreateShowDto, user: User): Promise<Shows> {
    const movie = await this.movieService.findOne(createShowDto.movieId);
    if (!movie) {
      throw new NotFoundException('Movie does not Found');
    }
    const datetime = new Date(createShowDto.time);
    if (movie.releaseDate > datetime || datetime.getTime() < Date.now()) {
      throw new NotAcceptableException('Please Fill valid ShowTime');
    }
    const totalseat =
      createShowDto.goldSeat +
      createShowDto.silverSeat +
      createShowDto.platinumSeat;
    const show = this.showsRepo.create(createShowDto);
    show.totalSeats = totalseat;
    show.availableSeats = totalseat;
    show.time = datetime;
    show.user = user;
    show.movie = movie;
    const savedShow = await this.showsRepo.save(show);
    if (!savedShow) {
      throw new NotAcceptableException('Show Does not inserted');
    }
    return savedShow;
  }

  async findAll(): Promise<Shows[]> {
    const shows = await this.showsRepo.find({
      relations: {
        movie: true,
        user: true,
      },
    });
    if (shows.length === 0) {
      throw new NotFoundException('Shows are Not Found in db');
    }
    return shows;
  }

  async findOne(id: number): Promise<Shows> {
    const show = await this.showsRepo.findOne({
      where: { id },
      relations: {
        movie: true,
        user: true,
      },
    });
    if (!show) {
      throw new NotFoundException('User is Not Found');
    }
    return show;
  }

  async update(id: number, updateShowDto: UpdateShowDto): Promise<Shows> {
    const show = await this.findOne(id);
    const date = new Date(updateShowDto.time);
    updateShowDto.time = date;
    
    if(date.getTime()< Date.now()){
      throw new NotAcceptableException("You can not update past time in show")
    }
    Object.assign(show, updateShowDto);
    const updatedShow = await this.showsRepo.save(show);
    if (!updatedShow) {
      throw new NotAcceptableException('Show time  Does not updated..');
    }
    return updatedShow;
  }

  async remove(id: number): Promise<Shows> {
    const show = await this.findOne(id);
    const removedShow = await this.showsRepo.remove(show);
    if (!removedShow) {
      throw new NotAcceptableException('show does not removed..');
    }
    return removedShow;
  }
}
