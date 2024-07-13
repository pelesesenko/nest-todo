import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../boards/board.entity';

export enum FieldTypes {
  string = 'STRING',
  number = 'NUMBER',
  select = 'SELECT',
}

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ enum: FieldTypes })
  type: FieldTypes;

  @Column({ type: 'json', nullable: true })
  options: string;

  @Column({ type: 'int', nullable: true })
  maxIndex: number;

  @ManyToOne(() => Board, (board) => board.fields, { cascade: true })
  @JoinColumn()
  board: Board;

  @Column()
  userId: number;

  @Column({ nullable: true })
  boardId: number;
}
