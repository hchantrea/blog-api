import { Revenue } from './../models/revenue.model';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('daily_schedulers')
export class DailyScheduler extends BaseEntity {
  @PrimaryColumn({ type: 'date', name: 'date'})
  date: Date;

  @Column({ type: 'jsonb', name: 'revenued' })
  revenued: Revenue;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
