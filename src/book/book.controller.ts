import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './services/book.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { SearchBookDto } from './dtos/search-book.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { AccessEpisodeGuard } from './guards/access-episode.guard';
import { BookSwagger } from './decorators/book-swagger.decorator';

//? TODO -> Authorize user with guard before access routes
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @BookSwagger.Search()
  @Post('search')
  searchBooks(@Body() searchBlogDto: SearchBookDto) {
    return this.bookService.searchBooks(searchBlogDto.name);
  }
  @BookSwagger.GetBookEpisodes()
  @UseGuards(JwtAuthGuard, AccessEpisodeGuard)
  @Get('episodes/:bookId')
  getBookEpisodes(
    @Param() { bookId }: { bookId: string },
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.bookService.getBookEpisodes(bookId, skip, take);
  }
  @BookSwagger.GetEpisode()
  @UseGuards(JwtAuthGuard, AccessEpisodeGuard)
  @Get('episode/:episodeId')
  getEpisode(@Param() { episodeId }: { episodeId: string }) {
    return this.bookService.getEpisode(episodeId);
  }
  @BookSwagger.GetBook()
  @Get('/:id')
  getBook(@Param() { id }: SingleIdValidator) {
    return this.bookService.getBookById(id);
  }
  @BookSwagger.GetCategoriesBook()
  //? TODO Pagination
  @Get('category/:id')
  getCategoriesBook(@Param() { id }: { id: number }) {
    return this.bookService.categoriesBook(id);
  }
}
