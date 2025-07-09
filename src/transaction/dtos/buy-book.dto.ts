import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class BuyBookDto {
  @IsUUID('4', { message: 'Book not found!' })
  bookId: string;
  
  userId: string;

  @IsString()
  @IsOptional()
  couponCode?: string;
}
