import { IsDefined, IsEmail, IsPhoneNumber, IsString, IsStrongPassword, ValidateIf, ValidationArguments, ValidatorConstraintInterface } from "class-validator"

export class LoginRequestDto {

    @IsEmail()
    @ValidateIf(o => !o.phone) // Validate email only if phone is not provided
    email?: string;

    @IsPhoneNumber('IR')
    @ValidateIf(o => !o.email) // Validate phone only if email is not provided
    phone?: string;

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    @IsString()
    @IsDefined()
    password: string;
}