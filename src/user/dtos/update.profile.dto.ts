import { IsAlphanumeric, IsEmail, IsString } from "class-validator";


export class UpdateProfileRequestDto {
    @IsString()
    @IsAlphanumeric()
    name?: string;
    @IsEmail()
    email?: string;

}