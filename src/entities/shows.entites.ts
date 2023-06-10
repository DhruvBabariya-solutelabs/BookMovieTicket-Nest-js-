import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from './user.entity';

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

  @ManyToOne(() => Movie, (movie) => movie.shows)
  movie: Movie;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
