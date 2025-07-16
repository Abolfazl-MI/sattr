import {
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class VerifyOtpRequestDto {
  @IsPhoneNumber('IR')
  phone: string;

  @IsString({})
  @Length(6, 6, { message: 'otp code is not valid' })
  code: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsString()
  password: string;
}
