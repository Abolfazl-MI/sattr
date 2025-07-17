import { forwardRef, Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookEntity } from './entities/book.entity';
import { CategoryEntity } from './entities/category.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeEntity } from './entities/episode.entity';
import { BookService } from './services/book.service';
import { BookDataAccess } from './services/book.data-access.service';

import { EpisodeDataAccess } from './episode-dataAcess.service';
import { UserFavoriteEntity } from 'src/user/entities/user.favorites';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, CategoryEntity, EpisodeEntity, UserFavoriteEntity]),
    BookModule,
    forwardRef(() => UserModule),
  ],
  controllers: [BookController],
  providers: [BookService, BookDataAccess, EpisodeDataAccess],
  exports: [BookDataAccess, EpisodeDataAccess]
})
export class BookModule { }
