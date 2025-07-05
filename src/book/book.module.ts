import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookEntity } from './entities/book.entity';
import { CategoryEntity } from './entities/category.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookDataAccess } from './book.data-access';
import { EpisodeEntity } from './entities/episode.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BookEntity , CategoryEntity , EpisodeEntity])],
  controllers: [BookController],
  providers: [BookService , BookDataAccess],
})
export class BookModule {}
