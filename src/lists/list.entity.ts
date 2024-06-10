import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '../base-entities/base-content';
import { Board } from '../boards/board.entity';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';

@Entity()
export class List extends BaseContent {
  @Column({ type: 'int' })
  rank: number;

  @ManyToOne(() => Board, (board) => board.lists)
  board: Board;

  @OneToMany(() => Task, (task) => task.list, { cascade: true })
  tasks: Task[];

  @ManyToOne(() => User)
  user: User;
}
