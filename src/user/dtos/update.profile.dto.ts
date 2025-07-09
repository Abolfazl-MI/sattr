import { IsAlphanumeric, IsEmail, IsOptional, IsString } from "class-validator";


export class UpdateProfileRequestDto {
    @IsString()
    @IsAlphanumeric()
    @IsOptional()
    name?: string;
    @IsEmail()
    @IsOptional()
    email?: string;
    // TODO discuss about user phone number update
    profilePicture?:string;
}

