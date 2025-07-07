import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { BookDataAccess } from 'src/book/services/book.data-access.service';

@Injectable()
export class TransactionService {
  buyBook(bookId: number, userId: string) {
    // const
  }

  verifyPayment() {
    return { message: 'Success' };
  }
}
