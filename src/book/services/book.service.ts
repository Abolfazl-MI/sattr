import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BookDataAccess } from './book.data-access.service';

@Injectable()
export class BookService {
  constructor(private readonly dataAccess: BookDataAccess) {}

  async getBookById(id: string) {
    const book = await this.dataAccess.findOneById(id);
    if (!book) throw new NotFoundException('Book not found!');

    return book;
  }

  async getBookEpisodes(id: string, skip: number, take: number) {
    const [episodes, total] = await this.dataAccess.findBookEpisodes(
      id,
      skip,
      take,
    );

    return { total, episodes };
  }

  async getEpisode(id: string) {
    const episode = await this.dataAccess.findOneEpisode(id);

    if (!episode) throw new NotFoundException('Episode not found!');

    return episode;
  }
}
