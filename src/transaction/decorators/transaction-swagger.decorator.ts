import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BuyProductDto } from '../dtos/buy-product.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { PurchaseType } from '../enums/purchase-type.enum';

export const TransactionSwagger = {
  BuyProduct: () => applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            format: 'uuid',
            example: '8d18a3b8-2b4e-4b8c-93a4-dde9dc84c1e0',
          },
          purchaseType: {
            type: 'string',
            enum: Object.values(PurchaseType),
            example: PurchaseType.PLAN,
          },
          couponCode: {
            type: 'string',
            example: 'SUMMER2025',
            nullable: true,
          },
        },
        required: ['productId', 'purchaseType'],
      },
    }),
    ApiOkResponse({
      description: 'Payment initiated successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'number', example: 200 },
          token: { type: 'string', example: 'payment-token-uuid' },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Product or Plan not found!' }),
    ApiConflictResponse({ description: 'You have already purchased this book.' }),
    ApiBadRequestResponse({ description: 'Payment failed or invalid input.' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
  VerifyPayment: () => applyDecorators(
    ApiParam({
      name: 'token',
      required: true,
      description: 'Payment token',
      example: 'payment-token-uuid',
    }),
    ApiOkResponse({
      description: 'Payment verified successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Verify payment is complete!' },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Transaction not found!' }),
    ApiBadRequestResponse({ description: 'The transaction was not successful!' }),
    ApiInternalServerErrorResponse({ description: 'There was an internal server error! Try again later' })
  ),
}; 