import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { VerifyOtpRequestDto } from './dto/verifyOtpRequest.dto';
import { RefreshTokenRequestDto } from './dto/refreshTokenRequest.dto';

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
  async verify(@Body() body: VerifyOtpRequestDto) {
    return await this.authService.verifyOtp(body);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: RefreshTokenRequestDto) {
    return await this.authService.refreshToken(body);
  }
}
