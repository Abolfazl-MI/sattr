import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { EpisodeEntity } from './entities/episode.entity';

@Injectable()
export class BookDataAccess {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    @InjectRepository(EpisodeEntity)
    private episodeRepository: Repository<EpisodeEntity>,
  ) {}

  findOneById(id: number) {
    return this.bookRepository.findOne({ where: { id } });
  }

  findBookEpisodes(bookId: number) {
    return this.episodeRepository.find({ where: { book: { id: bookId } } });
  }

  findOneEpisode(id: number) {
    return this.episodeRepository.findOne({ where: { id } });
  }
}
