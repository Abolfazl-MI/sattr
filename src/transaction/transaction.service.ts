import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BookDataAccess } from 'src/book/services/book.data-access.service';

import { MoreThan, Repository } from 'typeorm';
import { BuyProductDto } from './dtos/buy-product.dto';
import { v4 as uuid } from 'uuid';
import { TransactionEntity } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseType } from './enums/purchase-type.enum';
import { PlanDataAccess } from 'src/plan/plan.dataAccess.service';
import { CouponService } from 'src/coupon/services/coupon.service';
import { BookEntity } from 'src/book/entities/book.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { Status } from './enums/status.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserDataAccess } from 'src/user/services/user.dataAcess.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly bookDataAccess: BookDataAccess,
    private readonly userDataAccess: UserDataAccess,
    private readonly couponService: CouponService,
    private readonly planDataAccessService: PlanDataAccess,

    @InjectRepository(TransactionEntity)
    private readonly transactionEntity: Repository<TransactionEntity>,
  ) {}

  async buyProduct({
    productId,
    userId,
    couponCode = '',
    purchaseType,
  }: BuyProductDto) {
    try {
      // Products
      let book: BookEntity | null = null;
      let plan: PlanEntity | null = null;

      let productAmount = 0;

      if (purchaseType === PurchaseType.INDIVIDUAL) {
        book = await this.bookDataAccess.findOneById({
          id: productId,
          price: MoreThan(0),
          isIndividual: true,
        });

        if (!book) throw new NotFoundException('Product not found!');

        const alreadyPurchase = await this.userDataAccess.userMetaExists({
          where: {
            user: { id: userId },
            books: { id: book.id },
          },
        });

        // Check is user bought book before
        if (alreadyPurchase)
          throw new ConflictException('You have already purchased this book.');

        productAmount = book.price;
      } else {
        plan = await this.planDataAccessService.get(productId);
        if (!plan) throw new NotFoundException('Plan not found!');

        productAmount = plan.amount;
      }

      const { discountAmount, coupon } =
        await this.couponService.validateCoupon(couponCode, productAmount);

      const totalAmount = productAmount - discountAmount;

      //! Should send request to payment provider
      //! Check if total amount is not <= 0 and then send the request to payment provider

      // Mock payment result
      const paymentResult = {
        status: 100,
        data: {
          authority: uuid(),
        },
      };

      if (paymentResult.status === 100) {
        const createTransaction = this.transactionEntity.create({
          user: { id: userId },
          amount: totalAmount,
          purchaseType: book ? PurchaseType.INDIVIDUAL : PurchaseType.PLAN,
          book: book || undefined,
          plan: plan || undefined,
          token: paymentResult.data.authority,
          discount: discountAmount,
          couponId: coupon?.id,
        });

        await this.transactionEntity.insert(createTransaction);
        return { message: 200, token: createTransaction.token };
      }

      throw new HttpException('Payment failed.', HttpStatus.PAYMENT_REQUIRED);
    } catch (error) {
      if (error?.response?.error) throw error;
      console.log(error);
      throw new InternalServerErrorException(
        'There was an internal server error! Try again later',
      );
    }
  }

  async verifyPayment(token: string, userId: string) {
    try {
      const transaction = await this.transactionEntity.findOne({
        where: {
          token,
          status: Status.PENDING,
        },
        relations: {
          user: { userMeta: { books: true } },
          book: true,
          plan: true,
        },
      });

      if (!transaction) throw new NotFoundException('Transaction not found!');

      //! Request to payment provider to verify payment

      const verifyPaymentResult = {
        status: 200,
      };

      if (verifyPaymentResult.status !== 200) {
        await this.transactionEntity.update(
          { id: transaction.id },
          {
            status: Status.CANCELED,
          },
        );
        throw new BadRequestException('The transaction was not successful!');
      }

      if (transaction?.purchaseType === PurchaseType.INDIVIDUAL) {
        await this.verifyIndividualPayment(transaction.user, transaction.book);
      } else {
        await this.verifyPlanPayment(transaction.user, transaction.plan);
      }

      if (transaction.couponId) {
        await this.couponService.decreaseCouponCapacity(transaction.couponId);
      }

      await this.transactionEntity.update(
        { id: transaction.id },
        {
          status: Status.CONFIRMED,
        },
      );

      return { message: 'Verify payment is complete!' };
    } catch (error) {
      if (error?.response?.error) throw error;
      console.log(error);
      throw new InternalServerErrorException(
        'There was an internal server error! Try again later',
      );
    }
  }

  async verifyIndividualPayment(user: UserEntity, book: BookEntity) {
    user.userMeta.books.push(book);

    await this.userDataAccess.updateUserMeta(user.userMeta);
  }

  async verifyPlanPayment(user: UserEntity, plan: PlanEntity) {
    const userMeta = user.userMeta;
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000,
    );

    userMeta.subscriptionStartedAt = now;
    userMeta.subscriptionExpiresAt = expiresAt;
    userMeta.plan = plan;

    await this.userDataAccess.updateUserMeta(userMeta);
  }
}
