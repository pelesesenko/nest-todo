import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '@common/abstract-classes';
import { Board } from '../boards/board.entity';
import { Task } from '../tasks/task.entity';

@Entity('lists')
export class List extends BaseContent {
  @Column({ type: 'int' })
  rank: number;

  @ManyToOne(() => Board, (board) => board.lists, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @Column()
  boardId: number;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];

  @Column()
  userId: number;
}
