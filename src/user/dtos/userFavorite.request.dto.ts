import { Transform } from "class-transformer";
import { IsEnum, IsInstance, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { ListRequestDto } from "src/common/dtos/listRequestDto.dto";



export class UserFavoriteRequestDto {
    @IsUUID()
    userId: string

    @IsUUID()
    entityId: string;
}

export enum FavoiresFilter {
    books = 'books',
    episodes = 'episodes'
}
export class GetFavoritesQueryDto {
    @Transform(({ value }) => ("" + value).toLowerCase())
    @IsEnum(FavoiresFilter, { message: 'filter query required : books or episodes' })
    filter: FavoiresFilter
}

export class AddFavoriteQueryDto {
    @Transform(({ value }) => ("" + value).toLowerCase())
    @IsEnum(FavoiresFilter, { message: 'type query required : books or episodes' })
    type: FavoiresFilter

    @IsUUID()
    id: string
}
export class ListFavoriteItemsDto {
    @IsUUID()
    id: string

    @IsInstance(ListRequestDto)
    @ValidateNested({ each: true })
    @IsOptional()
    listRequest: ListRequestDto

}