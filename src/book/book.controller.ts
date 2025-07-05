import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';

//? TODO -> Authorize user with guard before access routes
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  getBook(@Param() { id }: { id: number }) {
    return this.bookService.getBookById(id);
  }

  @Get('/episodes/:id')
  getBookEpisodes(@Param() { id }: { id: number }) {
    return this.bookService.getBookEpisodes(id);
  }

  @Get('/episode/:id')
  getEpisode(@Param() { id }: { id: number }) {
    return this.bookService.getEpisode(id);
  }
}
