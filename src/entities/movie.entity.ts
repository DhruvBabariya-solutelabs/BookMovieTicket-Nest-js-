import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Shows } from './shows.entites';
import { MovieTicket } from './movie-ticket.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  releaseDate: Date;

  @Column('simple-array')
  casts: string[];

  @Column('simple-array')
  directors: string[];

  @Column('simple-array')
  choreographers: string[];

  @ManyToOne(() => User, (user) => user.movie)
  createdby: User;

  @OneToMany(() => Shows, (shows) => shows.movie, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  shows: Shows[];
}
