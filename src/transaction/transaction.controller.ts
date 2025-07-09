import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { BuyBookDto } from './dtos/buy-book.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('buy-book')
  async buyBook(
    @Req() req: Express.Request & { user: { id: number } },
    @Body() buyBookDto: BuyBookDto,
  ) {
    const result = await this.transactionService.buyBook({
      ...buyBookDto,
      userId: req.user.id,
    });

    return result;
  }
}
