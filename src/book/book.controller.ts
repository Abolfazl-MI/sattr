import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookService } from './services/book.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { SearchBookDto } from './dtos/search-book.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ApiBody, ApiParam } from '@nestjs/swagger';

//? TODO -> Authorize user with guard before access routes
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) { }
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        }
      },
      required: ['name']
    }
  })
  //? TODO Pagination
  @Post('search')
  searchBooks(@Body() searchBlogDto: SearchBookDto) {
    return this.bookService.searchBooks(searchBlogDto.name);
  }
  @ApiParam({
    name: 'id',
    required: true,
    description: 'book id',
    format: 'uuid',
    example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
  })
  //? TODO Guard 
  @UseGuards(JwtAuthGuard)
  @Get('episodes/:id')
  getBookEpisodes(
    @Param() { id }: SingleIdValidator,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.bookService.getBookEpisodes(id, skip, take);
  }
  @ApiParam({
    name: 'id',
    required: true,
    description: 'episode id, return single episode',
    format: 'uuid',
    example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
  })
  @Get('episode/:id')
  getEpisode(@Param() { id }: SingleIdValidator) {
    return this.bookService.getEpisode(id);
  }
  @ApiParam({
    name: 'id',
    required: true,
    description: 'book id, returns only book info',
    format: 'uuid',
    example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
  })
  @Get('/:id')
  getBook(@Param() { id }: SingleIdValidator) {
    return this.bookService.getBookById(id);
  }
  @ApiParam({
    name: 'id',
    required: true,
    description: 'category id, return category detail',
    format: 'uuid',
    example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
  })
  //? TODO Pagination
  @Get('category/:id')
  getCategoriesBook(@Param() { id }: { id: number }) {
    return this.bookService.categoriesBook(id);
  }
}
