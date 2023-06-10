import { seatType } from 'src/util/constant.util';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from './user.entity';

@Entity()
export class MovieTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showTime: Date;

  @Column({ enum: seatType })
  seat: string;

  @Column()
  movieTitle: string;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.movieTicket)
  user: User;
}
