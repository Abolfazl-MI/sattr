import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { PlanDataAccess } from './plan.dataAccess.service';


@Injectable()
export class PlanService {

    constructor(
        private readonly planDataAcess: PlanDataAccess
    ) { }

    async getAllPlans(request: ListRequestDto) {
        return this.planDataAcess.getAllPlans(request)
    }
}
