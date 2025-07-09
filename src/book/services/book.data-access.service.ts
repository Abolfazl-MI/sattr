import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like, Repository } from 'typeorm';
import { EpisodeEntity } from '../entities/episode.entity';
import { BookEntity } from '../entities/book.entity';
import { CategoryEntity } from '../entities/category.entitiy';


@Injectable()
export class BookDataAccess {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,

    @InjectRepository(EpisodeEntity)
    private episodeRepository: Repository<EpisodeEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

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

  searchBooks(bookName: string) {
    return this.bookRepository.find({
      where: { name: Like(`%${bookName}%`) },
    });
  }

  findOneCategory(options: FindOneOptions<CategoryEntity>) {
    return this.categoryRepository.findOne(options);
  }

  listBooks(options: FindManyOptions<BookEntity>) {
    return this.bookRepository.findAndCount(options)
  }
  createQueryBuilder(ailias: string) {
    return this.bookRepository.createQueryBuilder(ailias)
  }
}
