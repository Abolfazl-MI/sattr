import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction';
import { BullModule } from '@nestjs/bullmq';
import { TransactionConsumer } from './transaction.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transactions',
    }),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService , TransactionConsumer],
})
export class TransactionModule {}
