import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from '../boards/board.entity';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', array: true, default: ['USER'] })
  roles: UserRoles[];

  @CreateDateColumn()
  registered_at: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
