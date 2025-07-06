import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './services/book.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { SearchBookDto } from './dtos/search-book.dto';

//? TODO -> Authorize user with guard before access routes
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('search')
  searchBooks(@Body() searchBlogDto: SearchBookDto) {
    return this.bookService.searchBooks(searchBlogDto.name);
  }

  @Get('episodes/:id')
  getBookEpisodes(
    @Param() { id }: SingleIdValidator,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.bookService.getBookEpisodes(id, skip, take);
  }

  @Get('episode/:id')
  getEpisode(@Param() { id }: SingleIdValidator) {
    return this.bookService.getEpisode(id);
  }

  @Get('/:id')
  getBook(@Param() { id }: SingleIdValidator) {
    return this.bookService.getBookById(id);
  }

  @Get('category/:id')
  getCategoriesBook(@Param() { id }: { id: number }) {
    return this.bookService.categoriesBook(id);
  }
}
