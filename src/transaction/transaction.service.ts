import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

@Injectable()
export class TransactionService {
  queueEvents: QueueEvents;

  constructor(@InjectQueue('transactions') private transactionQueue: Queue) {
    this.queueEvents = new QueueEvents('transactions', {
      connection: { host: 'localhost', port: 6379 },
    });
  }

  async addTransactionToQueue(transactionData: any, queueName: string) {
    const job = await this.transactionQueue.add(queueName, transactionData, {
      backoff: 5000,
    });

    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  buyProduct() {
    return { message: 'Success' };
  }

  verifyPayment() {
    return { message: 'Success' };
  }
}
