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
import { UserService } from '../user/user.service';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';

import { generateOtpCode } from '../common/utills/otp.gen';
import { VerifyOtpRequestDto } from './dto/verify-request.dto';
import { RefreshTokenRequestDto } from './dto/refreshTokenRequest.dto';
import { JsonWebTokenError } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';
import * as bcrypt from 'bcrypt'
import { ForgetPasswordRequest } from './dto/forget-request.dto';
import { RequiredParamValidator, SingleIdValidator, VerifyForgetPasswordRequestDto } from 'src/common/dtos/single-id-validator';
import { JwtPayload } from 'src/common/interfaces/jwt.payload';
@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly jwtTokenService: JwtTokenService,
    private readonly userService: UserService,
  ) { }

  // Use bcrypt in verify 
  private OTP_PREFIX = 'otp:';
  private EMAIL_VERIFY_KEY = 'email-verify'
  private OTP_LIMIT_PREFIX = 'otp-limit:';
  private REFRESH_PREFIX = 'refresh:';
  private FORGET_PREFIX = 'forget'
  async requestOtp(request: RegisterUserRequestDto) {
    const userExist = await this.userService.userExists({
      where: {
        phone: request.phone
      }
    })
    if (userExist) throw new BadRequestException('User with provided phone number exists')
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
  /* use same as forget password for token generation */
  async sendEmailVerificationLink({ id }: SingleIdValidator) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new UnauthorizedException('user not found')
    if (user.isEmailVerified) {
      return {
        message: 'Already Verified'
      }
    }
    const token = await this.jwtTokenService.generateForgetToken(user.id)
    const hasRequestBefore = await this.cache.get(`${this.EMAIL_VERIFY_KEY}${user.email}`);
    // if(hasRequestBefore) throw new BadRequestException('Verification already sent')

    await this.cache.set(`${this.EMAIL_VERIFY_KEY}${user.email}`, token, 2 * 60 * 1000)


    let url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}/verify-email/${token}` : `${process.env.BASE_URL}/verify-email/${token}`

    // todo send email

    return {
      message: 'verification link sent',
      ...(process.env.NODE_ENV === 'development' && { url, token })
    }
  }

  async verifyEmail({ id }: SingleIdValidator, param: RequiredParamValidator) {
    const { param: token } = param

    const user = await this.userService.findUserById(id)


    const key = `${this.EMAIL_VERIFY_KEY}${user.email}`
    const storedToken = await this.cache.get(key)

    if (!storedToken) throw new BadRequestException('Invalid or Expired link')

    try {
      const { sub }: JwtPayload = await this.jwtTokenService.verifyForgetToken(token)
      await this.cache.del(key);
      if (sub === user.id) {
        await this.userService.verifyUserEmail(user.id)
        return {
          message: "verified"
        }
      } else {
        throw new BadRequestException('Invalid or Expired link')
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new BadRequestException('Invalid or Expired link')

      throw new InternalServerErrorException()
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

  async login(request: LoginRequestDto) {
    const { phone, email, password } = request
    const user = await this.userService.findUser({
      where: {
        phone, email
      }
    })
    if (!user || !user.password) throw new BadRequestException('Username or password is wrong')

    const samePassword = await bcrypt.compare(password, user.password)
    if (!samePassword) throw new BadRequestException('Username or password is wrong')

    await this.cache.del(`${this.REFRESH_PREFIX}${user.id}`)
    const { accessToken, refreshToken } =
      await this.jwtTokenService.generateTokens(user.id);
    await this.cache.set(`${this.REFRESH_PREFIX}${user.id}`, refreshToken,
      7 * 24 * 60 * 60, // store for 7 days in redis
    )
    return {
      profile: user,
      accessToken,
      refreshToken
    }
  }
  
  // Use crypto instead jwt
  // 
  async forgetPassword(request: ForgetPasswordRequest) {
    const { phone, sendWithEmail, ipAddress } = request
    const user = await this.userService.findUser({
      where: {
        phone
      }
    })

    if (!user) throw new NotFoundException('User with provided information not found')
    if (sendWithEmail && (!user.email || !user.isEmailVerified)) throw new BadRequestException('Email not found')

    // check if previously requested 
    const key = `${this.FORGET_PREFIX}${ipAddress}`
    const hasRequested = await this.cache.get(key)
    if (hasRequested) throw new BadRequestException('Multiple Forget Request Not allowed')

    const token = await this.jwtTokenService.generateForgetToken(user.id)

    await this.cache.set(key, token, 15 * 60 * 1000)

    let url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}/forget-password/${token}` : `${process.env.BASE_URL}/forget-password/${token}`


    if (sendWithEmail) {
      // send with email provider impl later
    } else {
      // send sms 
    }

    if (process.env.NODE_ENV === 'development') {
      return {
        message: 'instruction sent',
        url
      }
    }

    return {
      message: 'instruction sent'
    }
  }

  // Use phone crypto instead ipAddress
  // 
  async verifyForgetPasswordRequest(request: VerifyForgetPasswordRequestDto) {
    const { token, ipAddress } = request
    console.log(token, ipAddress)
    const key = `${this.FORGET_PREFIX}${ipAddress}`

    const tokenValue = await this.cache.get(key)
    if (!tokenValue) throw new UnauthorizedException('Invalid or Expired link')

    try {
      const { sub }: JwtPayload = await this.jwtTokenService.verifyForgetToken(token)
      const userExists = await this.userService.userExists({
        where: {
          id: sub
        }
      })
      if (!userExists) throw new UnauthorizedException('UnAuthorized request')
      const accessToken = await this.jwtTokenService.generateAccessToken(sub)
      return {
        accessToken,
        message: 'this token last only 5min, change your password by update'
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new BadRequestException('Refresh token expired');

      throw new InternalServerErrorException('');
    }
  }
}
