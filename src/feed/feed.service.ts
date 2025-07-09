import { Injectable } from '@nestjs/common';
import { FeedDataAcess } from './services/feed.dataAcess.service';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';

@Injectable()
export class FeedService {

    constructor(
        private readonly dataAcess: FeedDataAcess
    ) { }

    getHomeFeed(request: ListRequestDto) {
        return this.dataAcess.list(request);
    }
    getSinglefeed(request: SingleIdValidator,listReques:ListRequestDto) {
        return this.dataAcess.get(request,listReques)
    }
}
