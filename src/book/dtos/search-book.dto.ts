import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SearchBookDto {
  @MinLength(2, { message: 'Name can not be less than 2 character' })
  @IsNotEmpty()
  name: string;
}
