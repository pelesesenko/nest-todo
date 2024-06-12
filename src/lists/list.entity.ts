import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '../base-entities/base-content';
import { Board } from '../boards/board.entity';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';

@Entity()
export class List extends BaseContent {
  @Column({ type: 'int' })
  rank: number;

  @ManyToOne(() => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  board: Board;

  @Column()
  boardId: number;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;
}
