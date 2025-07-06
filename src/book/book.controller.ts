import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BookService } from './services/book.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

//? TODO -> Authorize user with guard before access routes
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBook(@Param() { id }: SingleIdValidator) {
    return this.bookService.getBookById(id);
  }

  @Get('/episodes/:id')
  getBookEpisodes(
    @Param() { id }: SingleIdValidator,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.bookService.getBookEpisodes(id, skip, take);
  }

  @Get('/episode/:id')
  getEpisode(@Param() { id }: SingleIdValidator) {
    return this.bookService.getEpisode(id);
  }
}
