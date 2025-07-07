import { Controller, HttpException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('buy-book/api')
  async buyProduct(@Param('id') bookId: number) {

  }
}
