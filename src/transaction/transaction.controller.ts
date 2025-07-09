import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { BuyProductDto } from './dtos/buy-product.dto';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

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
}
