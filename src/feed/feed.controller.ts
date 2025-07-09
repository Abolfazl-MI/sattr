import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) { }

  @Get()
  async getHomeFeeds(
    @Query() query: ListRequestDto
  ) {
    return this.feedService.getHomeFeed(query)
  }

  @Get('/:id')
  async getSingleFeed(
    @Param() param: SingleIdValidator,
    @Query() query: ListRequestDto
  ) {
    return this.feedService.getSinglefeed(param, query)
  }
}
