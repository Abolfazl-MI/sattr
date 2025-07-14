import { IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class RegisterUserRequestDto {
  @IsPhoneNumber('IR')
  phone: string;

  @IsStrongPassword()
  password: string;
}
