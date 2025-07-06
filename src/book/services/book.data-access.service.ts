import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpisodeEntity } from '../entities/episode.entity';
import { BookEntity } from '../entities/book.entity';

@Injectable()
export class BookDataAccess {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    @InjectRepository(EpisodeEntity)
    private episodeRepository: Repository<EpisodeEntity>,
  ) {}

  findOneById(id: string) {
    return this.bookRepository.findOne({ where: { id } });
  }

  findBookEpisodes(bookId: string, skip: number, take: number) {
    return this.episodeRepository.findAndCount({
      where: { book: { id: bookId } },
      skip: Number(skip) || 0,
      take: Number(take) || 0,
    });
  }

  findOneEpisode(id: string) {
    return this.episodeRepository.findOne({ where: { id } });
  }
}
