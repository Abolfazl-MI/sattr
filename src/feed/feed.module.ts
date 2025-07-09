import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedDataAcess } from './services/feed.dataAcess.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from './entities/section.entity';
import { BookEntity } from 'src/book/entities/book.entity';
import { CategoryEntity } from 'src/book/entities/category.entitiy';
import { BookDataAccess } from 'src/book/services/book.data-access.service';
import { BookModule } from 'src/book/book.module';
import { EpisodeEntity } from 'src/book/entities/episode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SectionEntity,
      BookEntity,
      CategoryEntity,
      EpisodeEntity
    ]),
    BookModule
  ],
  controllers: [FeedController],
  providers: [FeedService, FeedDataAcess],
})
export class FeedModule { }
