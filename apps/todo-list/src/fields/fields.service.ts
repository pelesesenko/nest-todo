import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field, FieldTypes } from './field.entity';
import { EntityManager, Repository } from 'typeorm';
import { FieldDto } from './dto/field.dto';
import { Board } from '../boards/board.entity';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldsRepository: Repository<Field>,
    private manager: EntityManager,
  ) {}
  async add(userId: number, dto: FieldDto) {
    const board = await this.manager.findOneBy(Board, {
      userId,
      id: dto.boardId,
    });
    if (!board) {
      throw new BadRequestException('Board with this id does not exists');
    }
    let field = this.fieldsRepository.create();
    field = Object.assign(field, dto, { userId });
    if (dto.type !== FieldTypes.select) {
      delete field.options;
    } else {
      if (!field.options) {
        throw new BadRequestException(
          'Values array is needed for field of type ARRAY',
        );
      }
      field.maxIndex = dto.options.length - 1;
    }
    return this.fieldsRepository.save(field);
  }

  async update(userId: number, id: number, dto: UpdateFieldDto) {
    const result = await this.fieldsRepository.update({ userId, id }, dto);
    return result?.affected > 0
      ? this.fieldsRepository.findOneBy({ id })
      : false;
  }

  async delete(userId: number, id: number) {
    const result = await this.fieldsRepository.delete({ userId, id });
    return result?.affected > 0;
  }
}
