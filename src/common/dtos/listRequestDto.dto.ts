import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListRequestDto {
    @IsInt()
    @Min(0, { message: 'take must be greater than 0' })
    @Type(() => Number)
    @IsOptional()
    take?: number

    @IsInt()
    @Min(0, { message: 'skip must be greater than 0' })
    @Type(() => Number)
    @IsOptional()
    skip?: number
}