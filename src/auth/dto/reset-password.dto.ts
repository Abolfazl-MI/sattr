import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsPhoneNumber('IR')
  phone: string;

  @IsString({})
  @Length(6, 6, { message: 'otp code is not valid' })
  code: string;
}
