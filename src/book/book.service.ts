import { Injectable, NotFoundException } from '@nestjs/common';
import { BookDataAccess } from './book.data-access';

@Injectable()
export class BookService {
  constructor(private readonly dataAccess: BookDataAccess) {}

  async getBookById(id: number) {
    const book = await this.dataAccess.findOneById(id);
    if (!book) throw new NotFoundException('Book not found!');

    return book;
  }

  getBookEpisodes(id: number) {
    return this.dataAccess.findBookEpisodes(id);
  }

  async getEpisode(id: number) {
    const episode = await this.dataAccess.findOneEpisode(id);

    if (!episode) throw new NotFoundException('Episode not found!');

    return episode;
  }
}
