import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { UserService } from '../user/user.service';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';

import { generateOtpCode } from '../common/utills/otp.gen';
import { VerifyOtpRequestDto } from './dto/verifyOtpRequest.dto';
import { RefreshTokenRequestDto } from './dto/refreshTokenRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly jwtTokenService: JwtTokenService,
    private readonly userService: UserService,
  ) {}

  private OTP_PREFIX = 'otp:';
  private OTP_LIMIT_PREFIX = 'otp-limit:';
  private REFRESH_PREFIX = 'refresh:';

  async requestOtp(request: RegisterUserRequestDto) {
    const otpKey = `${this.OTP_PREFIX}${request.phone}`;
    const limitKey = `${this.OTP_LIMIT_PREFIX}${request.phone}`;
    const limit = await this.cache.get<string>(limitKey);
    if (limit) {
      throw new ForbiddenException('You have already requested otp');
    }
    const otp = generateOtpCode();
    await this.cache.set<string>(otpKey, otp, 120);
    await this.cache.set<string>(limitKey, '1', 60);
    
    return { otp };
  }

  async verifyOtp(request: VerifyOtpRequestDto) {
    const otpKey = `${this.OTP_PREFIX}${request.phone}`;
    const savedOtp = await this.cache.get<string>(otpKey);
    if (!savedOtp || savedOtp !== request.code) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    await this.cache.del(otpKey);

    const user = await this.userService.registerUser({ ...request });
    const { accessToken, refreshToken } =
      await this.jwtTokenService.generateTokens(user.id);
    await this.cache.del(`${this.REFRESH_PREFIX}${user.id}`);
    await this.cache.set(
      `${this.REFRESH_PREFIX}${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60, // store for 7 days in redis
    );

    return {
      profile: {
        ...user,
      },
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(request: RefreshTokenRequestDto) {
    const key = `${this.REFRESH_PREFIX}${request.userId}`;
    const storedToken = await this.cache.get<string>(key);
    if (!storedToken || storedToken !== request.refreshToken) {
      throw new UnauthorizedException('User not found');
    }
    const verifyResutl = await this.jwtTokenService.verifyRefreshToken(
      request.refreshToken,
    );
    if (verifyResutl.sub !== request.userId) {
      throw new UnauthorizedException('User not found');
    }
    const { accessToken, refreshToken } =
      await this.jwtTokenService.generateTokens(request.userId);
    await this.cache.set(
      `${this.REFRESH_PREFIX}${request.userId}`,
      refreshToken,
      7 * 24 * 60 * 60, // store for 7 days in redis
    );

    return {
      token: {
        accessToken,
        refreshToken,
      },
    };
  }
}
