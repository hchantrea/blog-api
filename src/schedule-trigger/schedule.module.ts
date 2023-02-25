import { MonthlyScheduler } from './../lib/entitys/monthly-scheduler.entity';
import { DailyScheduler } from './../lib/entitys/daily-scheduler.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTriggerService } from './schedule-trigger.service';
import { JwtStrategy } from '../lib/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([DailyScheduler, MonthlyScheduler])],
  providers: [ScheduleTriggerService, JwtStrategy]
})
export class ScheduleTriggerModule {}
