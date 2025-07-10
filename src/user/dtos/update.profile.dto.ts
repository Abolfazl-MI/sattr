import { IsAlphanumeric, IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";


export class UpdateProfileRequestDto {
    @IsString()
    @IsAlphanumeric()
    @IsOptional()
    name?: string;
    @IsEmail()
    @IsOptional()
    email?: string;    
    profilePicture?:string;
}

