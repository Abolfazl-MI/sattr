import { IsPhoneNumber } from 'class-validator';

export class RegisterUserRequestDto {
  @IsPhoneNumber('IR')
  phone: string;

}
