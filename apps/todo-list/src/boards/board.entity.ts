import { Entity, Column, OneToMany } from 'typeorm';
import { BaseContent } from '@common/abstract-classes';
import { List } from '../lists/list.entity';
import { Field } from '../fields/field.entity';

@Entity('boards')
export class Board extends BaseContent {
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column()
  userId: number;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  @OneToMany(() => Field, (field) => field.board, {
    eager: true,
  })
  fields: Field[];
}
