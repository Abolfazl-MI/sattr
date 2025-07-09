import { IsInt, IsNumber, IsOptional, Min , Max} from 'class-validator';
import { Type } from 'class-transformer';

export class ListRequestDto {
    @IsInt()
    @Min(0, { message: 'take must be greater than 0' })
    @Max(10)
    @Type(() => Number)
    @IsOptional()
    take?: number

    @IsInt()
    @Min(0, { message: 'skip must be greater than 0' })
    @Type(() => Number)
    @IsOptional()
    skip?: number
}