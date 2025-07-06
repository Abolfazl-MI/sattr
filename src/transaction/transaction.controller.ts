import { Controller, HttpException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @UseGuards(JwtAuthGuard)
  @Post(':id/buy-product')
  async buyProduct(@Req() req, @Param('id') productId: number) {
    const response = await this.transactionService.addTransactionToQueue(
      {
        // userId: req.user.id,
        productId,
      },
      'buy-product',
    );

    if (response.status !== 200)
      throw new HttpException(response.message, response.status);

    return response;
  }
}
