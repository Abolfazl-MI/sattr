import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export function UuidParamSwagger(paramName: string, description: string) {
  return applyDecorators(
    ApiParam({
      name: paramName,
      required: true,
      description,
      format: 'uuid',
      example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
    })
  );
} 