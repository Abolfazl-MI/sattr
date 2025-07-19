import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UuidParamSwagger } from 'src/common/swagger/uuid-param-swagger.decorator';
import { PaginationQuerySwagger } from 'src/common/swagger/pagination-query-swagger.decorator';
import { SearchBodySwagger } from 'src/common/swagger/search-body-swagger.decorator';
import { BookEntity } from '../entities/book.entity';
import { EpisodeEntity } from '../entities/episode.entity';
import { CategoryEntity } from '../entities/category.entitiy';

export const BookSwagger = {
  Search: () => applyDecorators(
    SearchBodySwagger(),
    ApiOkResponse({
      description: 'List of books matching the search',
      type: BookEntity,
      isArray: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid search input.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  GetBookEpisodes: () => applyDecorators(
    UuidParamSwagger('bookId', 'book id'),
    PaginationQuerySwagger(),
    ApiOkResponse({
      description: 'List of episodes for the book',
      schema: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 2 },
          episodes: { type: 'array', items: { $ref: getSchemaPath(EpisodeEntity) } },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Book not found!' }),
    ApiBadRequestResponse({ description: 'Invalid book id or pagination input.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  GetEpisode: () => applyDecorators(
    UuidParamSwagger('episodeId', 'episode id, return single episode'),
    ApiOkResponse({
      description: 'Single episode details',
      type: EpisodeEntity,
    }),
    ApiNotFoundResponse({ description: 'Episode not found!' }),
    ApiBadRequestResponse({ description: 'Invalid episode id.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  GetBook: () => applyDecorators(
    UuidParamSwagger('id', 'book id, returns only book info'),
    ApiOkResponse({
      description: 'Book details',
      type: BookEntity,
    }),
    ApiNotFoundResponse({ description: 'Book not found!' }),
    ApiBadRequestResponse({ description: 'Invalid book id.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  GetCategoriesBook: () => applyDecorators(
    UuidParamSwagger('id', 'category id, return category detail'),
    ApiOkResponse({
      description: 'Category details with books',
      type: CategoryEntity,
    }),
    ApiNotFoundResponse({ description: 'Category not found!' }),
    ApiBadRequestResponse({ description: 'Invalid category id.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
};

function getSchemaPath(model: any) {
  return `#/components/schemas/${model.name}`;
}
