import { role } from 'src/util/constant.util';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Movie } from './movie.entity';
import { Shows } from './shows.entites';
import { MovieTicket } from './movie-ticket.entity';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  contact: string;

  @Exclude()
  @Column({ default: role.USER })
  role: string;

  @Column({ default: 1 })
  status: number;

  @OneToMany(() => Movie, (movie) => movie.createdby, { cascade: true })
  movie: Movie[];

  @OneToMany(() => Shows, (shows) => shows.user, { cascade: true })
  shows: Shows[];

  @OneToMany(() => MovieTicket, (movieTicket) => movieTicket.user, {
    cascade: true,
  })
  movieTicket: MovieTicket[];
}
