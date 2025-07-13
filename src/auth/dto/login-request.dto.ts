import { IsDefined, IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Validate, ValidateIf, ValidationArguments, ValidatorConstraintInterface } from "class-validator"


class AtLeastOneContactConstraint implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
        const { email, phone } = args?.object as any;
        return !!email || !!phone;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Either email or phone must be provided'
    }
}



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