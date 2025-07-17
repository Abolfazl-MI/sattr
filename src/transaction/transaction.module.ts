import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { BookModule } from 'src/book/book.module';
import { UserModule } from 'src/user/user.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BookModule,
    UserModule,
    CouponModule,
    PlanModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
