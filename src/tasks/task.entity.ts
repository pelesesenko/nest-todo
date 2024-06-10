import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseContent } from '../base-entities/base-content';
import { List } from '../lists/list.entity';
import { User } from '../users/user.entity';

@Entity()
export class Task extends BaseContent {
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column({ type: 'int' })
  rank: number;

  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  @ManyToOne(() => User)
  user: User;
}
