import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function PaginationQuerySwagger() {
  return applyDecorators(
    ApiQuery({
      name: 'skip',
      required: false,
      type: Number,
      description: 'Number of items to skip',
      example: 0,
    }),
    ApiQuery({
      name: 'take',
      required: false,
      type: Number,
      description: 'Number of items to take',
      example: 10,
    })
  );
} 