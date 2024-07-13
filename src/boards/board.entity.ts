import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '../base-entities/base-content';
import { User } from '../users/user.entity';
import { List } from '../lists/list.entity';
import { Field } from '../fields/field.entity';

@Entity('boards')
export class Board extends BaseContent {
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  @OneToMany(() => Field, (field) => field.board, {
    eager: true,
  })
  fields: Field[];
}
