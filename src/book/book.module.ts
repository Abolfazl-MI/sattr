import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookEntity } from './entities/book.entity';
import { CategoryEntity } from './entities/category.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeEntity } from './entities/episode.entity';
import { BookService } from './services/book.service';
import { BookDataAccess } from './services/book.data-access.service';

@Module({
  imports:[TypeOrmModule.forFeature([BookEntity , CategoryEntity , EpisodeEntity])],
  controllers: [BookController],
  providers: [BookService , BookDataAccess],
})
export class BookModule {}
