import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function SearchBodySwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      },
    })
  );
} 