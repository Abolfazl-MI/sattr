import { Controller, Get, ParseIntPipe, Query, UsePipes } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';



@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  @Get()
  getPlans(
    @Query() query: ListRequestDto
  ) {
    return this.planService.getAllPlans(query)
  }
}
