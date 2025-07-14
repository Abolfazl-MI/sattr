import {
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class VerifyOtpRequestDto {
  @IsPhoneNumber('IR')
  phone: string;

  @IsStrongPassword()
  password: string;

  @IsString({})
  @Length(6, 6, { message: 'otp code is not valid' })
  code: string;
}
