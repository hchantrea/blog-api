import { Role } from './../enum/role.enum';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'first_name', length: 64 })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', length: 64 })
  lastName: string;

  @Column({ type: 'varchar', length: 128 })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.Editor] })
  roles: Role[];

  @Column({ type: 'text', default: null })
  profile: string;

  @Column({ type: 'text', name: 'refresh_token', default: null })
  refreshToken: string;

  @Column({ type: 'text', name: 'code', default: null })
  code: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

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
