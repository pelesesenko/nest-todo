import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '../base-entities/base-content';
import { User } from '../users/user.entity';
import { List } from '../lists/list.entity';

@Entity()
export class Board extends BaseContent {
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: 'CASCADE',
    // cascade: true,
  })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];
}
