import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity } from '../entities/coupon.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class CouponDataAccessService {
  constructor(
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
  ) {}

  findCoupon(code: string) {
    return this.couponRepository.findOneBy({
      code,
      isActive: true,
      expiresAt: MoreThan(new Date()),
      capacity: MoreThan(0),
    });
  }

  findById(id: number) {
    return this.couponRepository.findOneBy({ id , isActive:true });
  }

  update(coupon: CouponEntity) {
    return this.couponRepository.update({ id: coupon.id }, coupon);
  }
}
