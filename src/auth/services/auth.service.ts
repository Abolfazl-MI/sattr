import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { JwtTokenService } from './jwt.service';
import { UserService } from '../../user/user.service';
import { RegisterUserRequestDto } from '../../common/dto/registerUserRequestDto';

import { generateOtpCode } from '../../common/utils/otp.gen';
import { VerifyOtpRequestDto } from '../dto/verify-request.dto';
import { RefreshTokenRequestDto } from '../dto/refreshTokenRequest.dto';
import { JsonWebTokenError } from '@nestjs/jwt';
import { LoginRequestDto } from '../dto/login-request.dto';
import { ForgetPasswordRequest } from '../dto/forget-request.dto';
import {
  RequiredParamValidator,
  SingleIdValidator,
} from 'src/common/dtos/single-id-validator';
import { JwtPayload } from 'src/common/interfaces/jwt.payload';
import { OtpService } from './otp.service';
import { comparePassword } from 'src/common/utils/bcrypt';
import { hashPhone } from 'src/common/utils/crypto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly jwtTokenService: JwtTokenService,
    private readonly userService: UserService,
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
      password: request.password,
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

  async sendEmailVerificationLink({ id }: SingleIdValidator) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new UnauthorizedException('user not found');
    if (user.isEmailVerified) {
      return {
        message: 'Already Verified',
      };
    }
    const token = await this.jwtTokenService.generateForgetToken(user.id);
    const hasRequestBefore = await this.cache.get(
      `${this.EMAIL_VERIFY_KEY}${user.email}`,
    );
    if (hasRequestBefore)
      throw new BadRequestException('Verification already sent');

    await this.cache.set(
      `${this.EMAIL_VERIFY_KEY}${user.email}`,
      token,
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

  async verifyEmail({ id }: SingleIdValidator, param: RequiredParamValidator) {
    const { param: token } = param;

    const user = await this.userService.findUserById(id);

    const key = `${this.EMAIL_VERIFY_KEY}${user.email}`;
    const storedToken = await this.cache.get(key);

    if (!storedToken) throw new BadRequestException('Invalid or Expired link');

    try {
      const { sub }: JwtPayload =
        await this.jwtTokenService.verifyForgetToken(token);
      await this.cache.del(key);
      if (sub === user.id) {
        await this.userService.verifyUserEmail(user.id);
        return {
          message: 'verified',
        };
      } else {
        throw new BadRequestException('Invalid or Expired link');
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new BadRequestException('Invalid or Expired link');

      throw new InternalServerErrorException();
    }
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
    //
    // 0919
    const user = await this.userService.findUser({
      where: [{ phone }, { email }],
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
    const bcryptPhone = hashPhone(phone);
    const key = `${this.FORGET_PREFIX}${bcryptPhone}`;
    const hasRequested = await this.cache.get(key);
    if (hasRequested)
      throw new BadRequestException('Multiple Forget Request Not allowed');

    const otpCode = generateOtpCode(4);

    await this.cache.set(key, otpCode, 15 * 60 * 1000);

    return {
      message: 'Verification code sended!',
      ...(process.env.NODE_ENV === 'development' && { code: otpCode }),
    };
  }

  // Use phone crypto instead ipAddress
  //
  async verifyForgetPasswordRequest({ code, phone }: ResetPasswordDto) {
    const bcryptPhone = hashPhone(phone);
    const key = `${this.FORGET_PREFIX}${bcryptPhone}`;

    const getCode = await this.cache.get(key);
    if (!getCode || getCode !== code)
      throw new UnauthorizedException('Invalid code');

    try {
      const user = await this.userService.findUser({
        where: {
          phone,
        },
      });
      if (!user) throw new UnauthorizedException('UnAuthorized request');
      const accessToken = await this.jwtTokenService.generateAccessToken(
        user.id,
      );
      return {
        accessToken,
        message: 'this token last only 5min, change your password by update',
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new BadRequestException('Refresh token expired');

      throw new InternalServerErrorException('');
    }
  }
}
