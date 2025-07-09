import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entity/plan.entity';
import { PlanDataAcess } from './plan.dataAccess.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  controllers: [PlanController],
  providers: [PlanService, PlanDataAcess],
  exports: [PlanDataAcess],
})
export class PlanModule {}
