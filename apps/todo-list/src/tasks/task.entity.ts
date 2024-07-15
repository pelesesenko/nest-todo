import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent } from '@common/abstract-classes';
import { List } from '../lists/list.entity';
import { Field } from '../fields/field.entity';
import { SelFieldValue } from './sel-field-value.entity';
import { StrFieldValue } from './str-field-value.entity';
import { NumFieldValue } from './num-field-values.entity';

@Entity('tasks')
export class Task extends BaseContent {
  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column({ type: 'int' })
  rank: number;

  @ManyToOne(() => List, (list) => list.tasks, {
    onDelete: 'CASCADE',
  })
  list: List;

  @Column()
  listId: number;

  @Column()
  userId: number;

  @OneToMany(() => SelFieldValue, (sel) => sel.task, {
    eager: true,
  })
  selectValues: SelFieldValue[];

  @OneToMany(() => StrFieldValue, (sel) => sel.task, {
    eager: true,
  })
  stringValues: StrFieldValue[];

  @OneToMany(() => NumFieldValue, (sel) => sel.task, {
    eager: true,
  })
  numberValues: NumFieldValue[];
  //Чтоб иметь возможность добавить поля в ответ на запрос задачи
  fields?: Field[];
}
