import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { generateOtpCode } from 'src/common/utills/otp.gen';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  private OTP_PREFIX = 'otp:';

  async requestOtp(phone: string) {
    const otpKey = `${this.OTP_PREFIX}${phone}`;
    const limit = await this.cache.get<string>(otpKey);

    if (limit) {
      throw new ForbiddenException('You have already requested otp');
    }
    const otp = generateOtpCode();
    await this.cache.set<string>(otpKey, otp, 2 * 60 * 1000);

    return { otp };
  }

  async verifyOtp(phone: string, code: string) {
    const otpKey = `${this.OTP_PREFIX}${phone}`;
    const savedOtp = await this.cache.get<string>(otpKey);

    if (!savedOtp || savedOtp !== code) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
  }
}
