import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './services/book.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { SearchBookDto } from './dtos/search-book.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { AccessEpisodeGuard } from './guards/access-episode.guard';
import { Response } from 'express';

//? TODO -> Authorize user with guard before access routes
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
      required: ['name'],
    },
  })
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
  @UseGuards(JwtAuthGuard, AccessEpisodeGuard)
  @Get('episodes/:bookId')
  getBookEpisodes(
    @Param() { bookId }: { bookId: string },
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.bookService.getBookEpisodes(bookId, skip, take);
  }
  @ApiParam({
    name: 'id',
    required: true,
    description: 'episode id, return single episode',
    format: 'uuid',
    example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
  })
  @UseGuards(JwtAuthGuard, AccessEpisodeGuard)
  @Get('episode/:episodeId')
  getEpisode(@Param() { episodeId }: { episodeId: string }) {
    return this.bookService.getEpisode(episodeId);
  }

  @Get('/stream/:episodeId')
  @UseGuards(JwtAuthGuard, AccessEpisodeGuard)
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'audio/mp3')
  async streamEpisode(
    @Param('episodeId') id: string,
    @Headers() headers: Record<string, string>,
    @Res() res: Response,
  ) {
    return this.bookService.streamAudioFile(id, headers.range, res);
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
