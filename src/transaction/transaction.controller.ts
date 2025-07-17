import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { BuyProductDto } from './dtos/buy-product.dto';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { PurchaseType } from './enums/purchase-type.enum';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }
  @ApiBody({
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
          example: PurchaseType.PLAN, // or any valid enum value
        },
        couponCode: {
          type: 'string',
          example: 'SUMMER2025',
          nullable: true,
        },
      },
      required: ['productId', 'purchaseType'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('buy-product')
  async buyProduct(
    @Req() req: Express.Request,
    @Body() buyBookDto: BuyProductDto,
  ) {
    const result = await this.transactionService.buyProduct({
      ...buyBookDto,
      userId: req.user.id,
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verify-payment/:token')
  async verifyPayment(
    @Req() req: Express.Request,
    @Param() { token }: { token: string },
  ) {
    const result = await this.transactionService.verifyPayment(
      token,
      req.user.id,
    );

    return result;
  }
}
