import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shows } from 'src/entities/shows.entites';
import { ShowService } from './show.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shows]), MovieModule],
  controllers: [ShowController],
  providers: [ShowService],
  exports: [ShowService],
})
export class ShowModule {}
