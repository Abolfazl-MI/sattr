import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { VerifyOtpRequestDto } from './dto/verifyOtpRequest.dto';
import { RefreshTokenRequestDto } from './dto/refreshTokenRequest.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
