import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '@common/decorators';

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
}
