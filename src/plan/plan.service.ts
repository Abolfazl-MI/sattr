import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from './entity/plan.entity';
import { Repository } from 'typeorm';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { PlanDataAcess } from './plan.dataAccess.service';


@Injectable()
export class PlanService {

    constructor(
        private readonly planDataAcess: PlanDataAcess
    ) { }

    async getAllPlans(request: ListRequestDto) {
        return this.planDataAcess.getAllPlans(request)
    }
}
