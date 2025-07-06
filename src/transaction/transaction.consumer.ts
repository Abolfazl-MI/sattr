import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TransactionService } from './transaction.service';

@Processor('transactions')
export class TransactionConsumer extends WorkerHost {
  constructor(private readonly transactionService: TransactionService) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case 'buy-product': {
        return this.transactionService.buyProduct();
      }
      case 'verify-payment': {
        return this.transactionService.verifyPayment();
      }
    }
  }
}
