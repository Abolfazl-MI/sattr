import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponDataAccessService } from './coupon.data-access.service';
import { TYPE } from '../enums/type.enum';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponDataAccessService: CouponDataAccessService,
  ) {}

  async validateCoupon(code: string, price: number) {
    if (!code) return { discountAmount: 0, coupon: null };

    const coupon = await this.couponDataAccessService.findCoupon(code);

    let discountAmount = 0;
    if (!coupon)
      throw new BadRequestException('Coupon not found or has expired.');

    if (coupon.type === TYPE.PERCENTAGE) {
      // Decrease a number by a percentage
      discountAmount = price * (coupon.value / 100);
    } else {
      discountAmount = coupon.value;
    }

    return {
      discountAmount,
      coupon,
    };
  }
}
