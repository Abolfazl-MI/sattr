import { IsBoolean, IsOptional, IsPhoneNumber } from 'class-validator';

export class ForgetPasswordRequest {
  @IsPhoneNumber('IR')
  phone: string;

  @IsBoolean()
  @IsOptional()
  sendWithEmail?: boolean;

  ipAddress: string;
}
