import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BookDataAccess } from 'src/book/services/book.data-access.service';
import { UserDataAccess } from 'src/user/user.data-access.service';
import { MoreThan, Repository } from 'typeorm';
import { BuyProductDto } from './dtos/buy-product.dto';
import { v4 as uuid } from 'uuid';
import { TransactionEntity } from './entities/transaction';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseType } from './enums/purchase-type.enum';
import { PlanDataAccess } from 'src/plan/plan.dataAccess.service';
import { CouponService } from 'src/coupon/services/coupon.service';
import { BookEntity } from 'src/book/entities/book.entity';
import { PlanEntity } from 'src/plan/entity/plan.entity';

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
        book = await this.bookDataAccess.findOneById(productId, {
          price: MoreThan(0),
          isIndividual: true,
        });

        if (!book) throw new NotFoundException('Product not found!');

        const alreadyPurchase = await this.userDataAccess.exists({
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

  verifyPayment() {
    return { message: 'Success' };
  }
}
