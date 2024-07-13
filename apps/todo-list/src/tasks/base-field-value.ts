import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field } from '../fields/field.entity';
import { Task } from '../tasks/task.entity';

export abstract class BaseFieldValue {
  @PrimaryColumn({ name: 'task_id', type: 'int' })
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @PrimaryColumn({ name: 'field_id', type: 'int' })
  @ManyToOne(() => Field, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field: Field;
}
