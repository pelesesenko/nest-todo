import { Column, Entity } from 'typeorm';
import { BaseFieldValue } from '../base-entities/base-field-value';

@Entity('string_field_values')
export class StrFieldValue extends BaseFieldValue {
  @Column()
  value: string;
}
