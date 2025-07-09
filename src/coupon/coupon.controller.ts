import { Controller } from '@nestjs/common';
import { CouponService } from './services/coupon.service';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}
}
