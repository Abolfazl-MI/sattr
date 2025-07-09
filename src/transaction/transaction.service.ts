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
import { UserDataAccess } from 'src/user/user.data-access.service';
import { MoreThan, Repository } from 'typeorm';
import { BuyBookDto } from './dtos/buy-book.dto';
import { CouponDataAccessService } from 'src/coupon/services/coupon.data-access.service';
import { CouponEntity } from 'src/coupon/entities/coupon.entity';
import { TYPE } from 'src/coupon/enums/type.enum';
import { v4 as uuid } from 'uuid';
import { TransactionEntity } from './entities/transaction';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseType } from './enums/purchase-type.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly bookDataAccess: BookDataAccess,
    private readonly userDataAccess: UserDataAccess,
    private readonly couponDataAccessService: CouponDataAccessService,

    @InjectRepository(TransactionEntity)
    private readonly transactionEntity: Repository<TransactionEntity>,
  ) {}

  // Steps :
  // Check is book exist -> done
  // Check is user bought book -> done
  // Check is coupon valid -> done
  // Decrease coupon value from price -> done
  // Return token to buy -> done
  async buyBook({ bookId, userId, couponCode = '' }: BuyBookDto) {
    try {
      const findBook = await this.bookDataAccess.findOneById(bookId, {
        price: MoreThan(0),
        isIndividual: true,
      });

      if (!findBook) throw new NotFoundException('Book not found!');

      // Check is user bought book
      const userMeta = await this.userDataAccess.findUserMeta(userId);
      if (userMeta) {
        const hasUserAlreadyPurchaseTheBook = userMeta.books.some(
          (book) => book.id === findBook.id,
        );

        if (hasUserAlreadyPurchaseTheBook)
          throw new ConflictException('You have already purchased this book.');
      }

      // Handle coupon
      let coupon: CouponEntity | null = null;
      let discount = 0;

      if (couponCode) {
        coupon = await this.couponDataAccessService.findCoupon(couponCode);

        if (!coupon)
          throw new BadRequestException('Coupon not found or has expired.');

        if (coupon.type === TYPE.PERCENTAGE) {
          // Decrease a number by a percentage
          discount = findBook.price * (coupon.value / 100);
        } else {
          discount = coupon.value;
        }
      }

      // Should send request to payment provider
      //! Before sending a request , should check the amount > 0

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
          amount: findBook.price - discount,
          purchaseType: PurchaseType.INDIVIDUAL,
          book: findBook,
          token: paymentResult.data.authority,
          discount,
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
