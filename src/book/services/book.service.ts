import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BookDataAccess } from './book.data-access.service';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';

@Injectable()
export class BookService {
  constructor(private readonly dataAccess: BookDataAccess) {}

  async getBookById(id: string) {
    const book = await this.dataAccess.findOneById({ id });
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
    const episode = await this.dataAccess.findOneEpisode({ where: { id } });

    if (!episode) throw new NotFoundException('Episode not found!');

    return episode;
  }

  async searchBooks(bookName: string) {
    return this.dataAccess.searchBooks(bookName);
  }

  async categoriesBook(id: number) {
    const result = await this.dataAccess.findOneCategory({
      where: { id, isActive: true },
      relations: { books: true },
    });

    if (!result) throw new NotFoundException('Category not found!');

    return result;
  }

  async streamAudioFile(id: string, rangeHeader: string, res: Response) {
    const episode = await this.dataAccess.findOneEpisode({ where: { id } });
    if (!episode) throw new NotFoundException('Episode not found');

    const episodePath = join(process.cwd(), 'private/episodes', `${episode.name}.mp3`);
    const { size } = statSync(episodePath);

    if (rangeHeader) {
      const [startStr, endStr] = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : size - 1;
      const chunkSize = end - start + 1;

      const fileStream = createReadStream(episodePath, { start, end });
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunkSize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, headers);
      fileStream.pipe(res);
    } else {
      const headers = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, headers);
      createReadStream(episodePath).pipe(res);
    }
  }
}
