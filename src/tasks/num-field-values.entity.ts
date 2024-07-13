import { Column, Entity } from 'typeorm';
import { BaseFieldValue } from '../base-entities/base-field-value';

@Entity('number_field_values')
export class NumFieldValue extends BaseFieldValue {
  @Column({ type: 'float' })
  value: number;
}
