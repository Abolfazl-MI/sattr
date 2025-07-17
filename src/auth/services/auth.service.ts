import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { RegisterUserRequestDto } from '../../common/dto/registerUserRequestDto';

import { generateOtpCode } from '../../common/utils/otp.gen';
import { VerifyOtpRequestDto } from '../dto/verify-request.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { JsonWebTokenError } from '@nestjs/jwt';
import { LoginRequestDto } from '../dto/login-request.dto';
import { ForgetPasswordRequest } from '../dto/forget-request.dto';
import {
  RequiredParamValidator,
  SingleIdValidator,
} from 'src/common/dtos/single-id-validator';
import { JwtPayload } from 'src/common/interfaces/jwt.payload';
import { OtpService } from './otp.service';
import { comparePassword, encodePassword } from 'src/common/utils/bcrypt';
import { hashData } from 'src/common/utils/crypto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { v4 as uuid } from 'uuid';

import { UserService } from 'src/user/services/user.service';
import { UserDataAccess } from 'src/user/services/user.dataAcess.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly jwtTokenService: JwtTokenService,
    private readonly userService: UserService,
    private readonly userDataAccessService: UserDataAccess,
    private readonly otpService: OtpService,
  ) {}

  // Use bcrypt in verify
  private EMAIL_VERIFY_KEY = 'email-verify';
  private REFRESH_PREFIX = 'refresh:';
  private FORGET_PREFIX = 'forget';
  async registerUser(request: RegisterUserRequestDto) {
    const userExist = await this.userService.userExists({
      where: {
        phone: request.phone,
      },
    });
    if (userExist)
      throw new BadRequestException('User with provided phone number exists');

    return this.otpService.requestOtp(request.phone);
  }

  async verifyUser(request: VerifyOtpRequestDto) {
    await this.otpService.verifyOtp(request.phone, request.code);

    const user = await this.userService.registerUser({
      phone: request.phone,
    });

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

  async login({ phone, email, password }: LoginRequestDto) {
    const user = await this.userService.findUser({
      where: [{ phone }, { email, isEmailVerified: true }],
    });

    if (!user) throw new BadRequestException('Username or password is wrong');

    const samePassword = await comparePassword(password, user.password);
    if (!samePassword)
      throw new BadRequestException('Username or password is wrong');

    await this.cache.del(`${this.REFRESH_PREFIX}${user.id}`);
    const { accessToken, refreshToken } =
      await this.jwtTokenService.generateTokens(user.id);

    await this.cache.set(
      `${this.REFRESH_PREFIX}${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60, // store for 7 days in redis
    );

    return {
      profile: user,
      accessToken,
      refreshToken,
    };
  }

  // Use crypto instead jwt
  //
  async forgetPassword({ phone }: ForgetPasswordRequest) {
    const user = await this.userService.findUser({
      where: {
        phone,
      },
    });

    if (!user)
      throw new NotFoundException('User with provided information not found');

    // check if previously requested
    const bcryptPhone = hashData(phone);
    const key = `${this.FORGET_PREFIX}${bcryptPhone}`;

    const hasRequested = await this.cache.get(key);
    if (hasRequested)
      throw new BadRequestException('Multiple Forget Request Not allowed');

    const otpCode = generateOtpCode(4);

    await this.cache.set(key, otpCode, 15 * 60 * 1000);

    // Send code with OTP provider

    return {
      message: 'Verification code sended!',
      ...(process.env.NODE_ENV === 'development' && { code: otpCode }),
    };
  }

  // Use phone crypto instead ipAddress
  //
  async resetPassword({ code, phone, password }: ResetPasswordDto) {
    const bcryptPhone = hashData(phone);
    const key = `${this.FORGET_PREFIX}${bcryptPhone}`;

    const getCode = await this.cache.get(key);
    if (!getCode || getCode !== code)
      throw new BadRequestException('Invalid code');

    try {
      const user = await this.userService.findUser({
        where: {
          phone,
        },
      });
      if (!user) throw new UnauthorizedException('UnAuthorized request');

      user.password = encodePassword(password);
      await this.userDataAccessService.updateUser(user);

      await this.cache.del(key);

      return { message: 'User password updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException();
    }
  }

  async sendEmailVerificationLink({ id }: SingleIdValidator) {
    const user = await this.userService.findUser({
      where: {
        id,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (!user.email) throw new BadRequestException('Email not provided');

    if (user.isEmailVerified) {
      return {
        message: 'Already Verified',
      };
    }

    const token = uuid();
    await this.cache.set(
      `${this.EMAIL_VERIFY_KEY}${token}`,
      user.email,
      2 * 60 * 1000,
    );

    let url =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:${process.env.PORT || 3000}/verify-email/${token}`
        : `${process.env.BASE_URL}/verify-email/${token}`;

    // todo send email

    return {
      message: 'verification link sent',
      ...(process.env.NODE_ENV === 'development' && { url, token }),
    };
  }

  async verifyEmail(
    { id }: SingleIdValidator,
    { param }: RequiredParamValidator,
  ) {
    const key = `${this.EMAIL_VERIFY_KEY}${param}`;
    const email: string | undefined = await this.cache.get(key);

    if (!email) throw new BadRequestException('Invalid or Expired link');

    await this.userService.verifyUserEmail(id, email);

    return { message: 'Email verified' };
  }
}
