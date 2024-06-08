import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '../base-entities/base-content';
import { User } from '../users/user.entity';
import { List } from '../lists/list.entity';

@Entity()
export class Board extends BaseContent {
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @ManyToOne(() => User, (user) => user.boards)
  user: User;

  @OneToMany(() => List, (list) => list.board, { cascade: true })
  lists: List[];
}
