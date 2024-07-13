import { Column, Entity } from 'typeorm';
import { BaseFieldValue } from './base-field-value';

@Entity('select_field_values')
export class SelFieldValue extends BaseFieldValue {
  @Column()
  value: number;
}
