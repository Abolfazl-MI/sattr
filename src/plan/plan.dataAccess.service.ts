import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ListRequestDto } from "src/common/dtos/listRequestDto.dto"
import { Repository } from "typeorm"
import { PlanEntity } from "./entity/plan.entity"



@Injectable()
export class PlanDataAcess {

    constructor(
        @InjectRepository(PlanEntity)
        private readonly repository: Repository<PlanEntity>,
    ) { }

    async getAllPlans(request: ListRequestDto) {
        const { skip, take } = request
        const [plans, count] = await this.repository.findAndCount(
            {
                skip,
                take
            }
        )
        return {
            plans,
            count
        }
    }
}
