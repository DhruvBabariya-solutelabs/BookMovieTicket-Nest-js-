import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from './user.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Shows {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: Date;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @Column()
  goldSeat: number;

  @Column()
  goldPrice: number;

  @Column()
  silverSeat: number;

  @Column()
  silverPrice: number;

  @Column()
  platinumSeat: number;

  @Column()
  platinumPrice: number;

  @Transform(({ obj }) => obj.movie.id)
  @ManyToOne(() => Movie, (movie) => movie.shows)
  movie: Movie;

  @Transform(({ obj }) => obj.user.id)
  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
