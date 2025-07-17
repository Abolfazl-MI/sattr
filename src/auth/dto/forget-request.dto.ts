import { IsPhoneNumber } from 'class-validator';

export class ForgetPasswordRequest {
  @IsPhoneNumber('IR')
  phone: string;
}
