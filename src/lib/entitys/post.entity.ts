import { Category } from './category.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => Category, { cascade: true })
  @JoinColumn()
  category: Category;

  @Column({ type: 'varchar', name: 'author_name', length: 50 })
  authorName: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', default: null })
  thumbnail: string;

  @Column( { type: 'int', default: 0 })
  view: number;

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
