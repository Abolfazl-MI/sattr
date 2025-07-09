import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { UserService } from '../user/services/user.service';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';

import { generateOtpCode } from '../common/utills/otp.gen';
import { VerifyOtpRequestDto } from './dto/verifyOtpRequest.dto';
import { RefreshTokenRequestDto } from './dto/refreshTokenRequest.dto';
import { JsonWebTokenError } from '@nestjs/jwt';

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
    const limit = await this.cache.get<string>(otpKey);

    if (limit) {
      throw new ForbiddenException('You have already requested otp');
    }
    const otp = generateOtpCode();
    await this.cache.set<string>(otpKey, otp, 2 * 60 * 1000);

    return { otp };
  }

  async verifyOtp(request: VerifyOtpRequestDto) {
    const otpKey = `${this.OTP_PREFIX}${request.phone}`;
    const savedOtp = await this.cache.get<string>(otpKey);

    if (!savedOtp || savedOtp !== request.code) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.cache.del(otpKey);

    const user = await this.userService.registerUser({ phone: request.phone });
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

  async refreshToken(
    request: RefreshTokenRequestDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const verifyResult = await this.jwtTokenService.verifyRefreshToken(
        request.refreshToken,
      );

      const user = await this.userService.findUserById(verifyResult.sub);
      if (!verifyResult || !user) {
        throw new NotFoundException('User not found');
      }

      const key = `${this.REFRESH_PREFIX}${user.id}`;
      await this.cache.del(key);

      const { accessToken, refreshToken } =
        await this.jwtTokenService.generateTokens(user.id);

      await this.cache.set(
        `${this.REFRESH_PREFIX}${user.id}`,
        refreshToken,
        7 * 24 * 60 * 60, // store for 7 days in redis
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);

      if (error instanceof JsonWebTokenError)
        throw new BadRequestException('Refresh token expired');

      throw new InternalServerErrorException('');
    }
  }
}
