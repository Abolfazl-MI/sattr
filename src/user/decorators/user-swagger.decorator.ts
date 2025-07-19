import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UuidParamSwagger } from 'src/common/swagger/uuid-param-swagger.decorator';
import { PaginationQuerySwagger } from 'src/common/swagger/pagination-query-swagger.decorator';
import { UserEntity } from '../entities/user.entity';
import { UserMetaEntity } from '../entities/userMeta.entity';

export const UserSwagger = {
  GetProfile: () => applyDecorators(
    ApiOkResponse({
      description: 'User profile details',
      type: UserEntity,
    }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  UpdateProfile: () => applyDecorators(
    ApiOkResponse({
      description: 'Profile updated successfully',
      type: UserEntity,
    }),
    ApiBadRequestResponse({ description: 'Invalid profile update input.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  GetFavorites: () => applyDecorators(
    PaginationQuerySwagger(),
    ApiOkResponse({
      description: 'List of user favorites',
      schema: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 5 },
          favorites: { type: 'array', items: { $ref: getSchemaPath(UserMetaEntity) } },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Favorites not found!' }),
    ApiBadRequestResponse({ description: 'Invalid pagination input.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
};

function getSchemaPath(model: any) {
  return `#/components/schemas/${model.name}`;
}
