import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { ApiParam } from '@nestjs/swagger';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) { }

  @Get()
  async getHomeFeeds(
    @Query() query: ListRequestDto
  ) {
    return this.feedService.getHomeFeed(query)
  }
  @ApiParam({
    name: 'id',
    required: true,
    description: 'returns single feed books',
  })
  @ApiParam({
    name: 'take',
    required: false,
    description: 'pagination for books in feed',
    schema: {
      default: 10,
      minimum: 1,
    }
  })
  @ApiParam({
    name: 'skip',
    required: false,
    description: 'pagination for books in feed',

    schema: {
      default: 0,
      minimum: 0,
    }
  })
  @Get('/:id')
  async getSingleFeed(
    @Param() param: SingleIdValidator,
    @Query() query: ListRequestDto
  ) {
    return this.feedService.getSinglefeed(param, query)
  }
}
