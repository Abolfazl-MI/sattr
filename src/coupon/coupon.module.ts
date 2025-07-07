import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CouponEntity])],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
