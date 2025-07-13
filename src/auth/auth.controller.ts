import { Body, Controller, Ip, Param, Patch, Post, Put, Req, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { VerifyOtpRequestDto } from './dto/verify-request.dto';
import { RefreshTokenRequestDto } from './dto/refreshTokenRequest.dto';
import { Response } from 'express';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RequiredParamValidator } from 'src/common/dtos/single-id-validator';
import { ForgetPasswordRequest } from './dto/forget-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Get password
  @Post('/register')
  async registerUser(@Body() body: RegisterUserRequestDto) {
    const code = await this.authService.requestOtp(body);
    if (process.env.NODE_ENV === 'development') {
      return code;
    } else {
      return {
        message: 'opt code sent',
      };
    }
  }

  @Post('/verify')
  async verify(
    @Body() body: VerifyOtpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(body);
    const {
      token: { accessToken, refreshToken },
    } = result;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Or 'Strict' or 'None' depending on your needs
      maxAge: 7 * 24 * 60 * 60, // Cookie expiration in milliseconds (e.g., 1 hour)
    });

    return { profile: result.profile, accessToken };
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(body);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Or 'Strict' or 'None' depending on your needs
      maxAge: 7 * 24 * 60 * 60, // Cookie expiration in milliseconds (e.g., 1 hour)
    });

    return { accessToken };
  }

  
  @Post('/login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, profile, refreshToken } = await this.authService.login(body)

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Or 'Strict' or 'None' depending on your needs
      maxAge: 7 * 24 * 60 * 60, // Cookie expiration in milliseconds (e.g., 1 hour)
    });
    return {
      profile,
      accessToken
    }
  }

  @Put('/forget-password')
  async handleForgetPassword(
    @Body() { phone, sendWithEmail }: ForgetPasswordRequest,
    @Ip() ip
  ) {
    return await this.authService.forgetPassword({
      ipAddress: ip,
      phone,
      sendWithEmail
    })
  }

  // Change 
  @UseGuards(JwtAuthGuard)
  @Post('/verify-email')
  async sendVerifyEmailLink(
    @Req() { user }: Express.Request
  ) {
    return await this.authService.sendEmailVerificationLink({ id: user.id })
  }

  @Get('/forget-password/:param')
  async handelForgetVerify(
    @Param() param: RequiredParamValidator,
    @Ip() ip
  ) {
    console.log(ip)
    return this.authService.verifyForgetPasswordRequest({
      ipAddress: ip,
      token: param.param
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put('/verify-email/:param')
  async verifyEmail(
    @Req() { user }: Express.Request,
    @Param() param: RequiredParamValidator
  ) {
    return await this.authService.verifyEmail({ id: user.id }, param)
  }

}
