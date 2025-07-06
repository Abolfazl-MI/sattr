import { IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsString()
  userId: string;
  @IsString()
  refreshToken: string;
}
