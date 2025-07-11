import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PurchaseType } from '../enums/purchase-type.enum';

export class BuyProductDto {
  @IsUUID('4', { message: 'Product not found!' })
  productId: string;

  @IsEnum(PurchaseType)
  purchaseType: PurchaseType;

  @IsString()
  @IsOptional()
  couponCode?: string;

  userId: string;
}
