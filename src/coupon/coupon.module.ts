import { Module } from '@nestjs/common';
import { CouponService } from './services/coupon.service';
import { CouponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './entities/coupon.entity';
import { CouponDataAccessService } from './services/coupon.data-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([CouponEntity])],
  controllers: [CouponController],
  providers: [CouponService, CouponDataAccessService],
  exports: [CouponDataAccessService],
})
export class CouponModule {}
