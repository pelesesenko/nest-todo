import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Task } from './task.entity';
import { List } from '../lists/list.entity';
import { TaskDto } from './dto/task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { FieldTypes } from '../fields/field.entity';
import { NumFieldValue } from './num-field-values.entity';
import { SelFieldValue } from './sel-field-value.entity';
import { StrFieldValue } from './str-field-value.entity';
import { SetFieldValueDto } from './dto/set-field-value.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private manager: EntityManager,
  ) {}

  private listRepository = this.manager.getRepository(List);

  private async checkAndGetParent(userId: number, listId: number) {
    try {
      return await this.listRepository.findOneOrFail({
        where: { userId, id: listId },
        relations: { tasks: true },
      });
    } catch {
      throw new BadRequestException(
        'List with this id does not exists or belongs to another user',
      );
    }
  }

  private async checkAndGetTask(
    userId: number,
    taskId: number,
    listId?: number,
  ) {
    if (listId) await this.checkAndGetParent(userId, listId);
    try {
      return await this.taskRepository.findOneOrFail({
        where: {
          userId,
          id: taskId,
        },
        relations: { list: true },
      });
    } catch {
      throw new BadRequestException(
        'Task with this id does not exists or belongs to another user',
      );
    }
  }

  async getAllByList(userId: number, listId: number) {
    await this.checkAndGetParent(userId, listId);
    return this.taskRepository.findBy({ listId });
  }

  async getById(userId: number, id: number, withFields: boolean = false) {
    if (withFields) {
      return this.getTaskWithFields(userId, id);
    }
    const result = await this.taskRepository.findOne({ where: { userId, id } });
    if (!result) throw new NotFoundException();
    return result;
  }

  async addOne(userId: number, dto: TaskDto) {
    await this.checkAndGetParent(userId, dto.listId);
    const rank =
      ((await this.taskRepository.maximum('rank', { listId: dto.listId })) ||
        0) + 1;
    console.log(rank, 'RANK');
    const task = this.taskRepository.create({
      ...dto,
      userId,
      rank,
    });
    return this.taskRepository.save(task);
  }

  async update(userId: number, id: number, data: UpdateTaskDto) {
    const result = await this.taskRepository.update({ userId, id }, data);
    return result?.affected > 0 ? this.taskRepository.findOneBy({ id }) : false;
  }

  async delete(userId: number, id: number) {
    const task = await this.checkAndGetTask(userId, id);
    const result = await this.taskRepository.delete({ userId, id });
    return result?.affected > 0
      ? (this.taskRepository
          .createQueryBuilder()
          .update()
          .set({ rank: () => 'rank - 1' })
          .where('listId = :listId AND id <> :id', { listId: task.listId, id })
          .andWhere('rank > :rank', { rank: task.rank })
          .execute(),
        true)
      : false;
  }
  async getTaskWithFields(userId: number, id: number) {
    const task = await this.taskRepository.findOne({
      relations: { list: { board: { fields: true } } },
      where: { userId, id },
    });
    if (!task) throw new BadRequestException('Task does not exists');

    const fields = task.list.board.fields;
    delete task.list;
    task.fields = fields;
    return task;
  }

  async setValue(userId: number, taskId: number, dto: SetFieldValueDto) {
    const task = await this.getTaskWithFields(userId, taskId);
    const field = task.fields.find((f) => f.id === dto.fieldId);
    const getResult = async (
      instance: NumFieldValue | SelFieldValue | StrFieldValue,
    ) => {
      instance.field = field;
      instance.task = task;
      instance.value = dto.value;
      const {
        task: { id: task_id },
        field: { id: field_id },
        value,
      } = await this.manager.save(instance);
      return { task_id, field_id, value };
    };

    if (!field) {
      throw new BadRequestException('This field does not exists in board');
    }

    if (typeof dto.value === 'number') {
      if (field.type === FieldTypes.string) {
        throw new BadRequestException('Value must be string');
      }
      if (
        field.type === FieldTypes.select &&
        !Array(field.maxIndex + 1).fill(true)[dto.value]
      ) {
        throw new BadRequestException(
          `Value must be integer between 0 and ${field.maxIndex}`,
        );
      }

      const Entity =
        field.type === FieldTypes.number ? NumFieldValue : SelFieldValue;
      return getResult(new Entity());
    } else {
      if (field.type !== FieldTypes.string) {
        throw new BadRequestException('Value must be number');
      }
      return getResult(new StrFieldValue());
    }
  }

  async move(userId: number, id: number, dto: MoveTaskDto) {
    const task = await this.checkAndGetTask(userId, id);

    const rankFrom = task.rank;
    const rankTo = dto.rank;
    const listFromId = task.listId;
    const listToId = dto.listId;
    const maxRankFrom = await this.taskRepository.maximum('rank', {
      listId: listFromId,
    });
    let maxRankTo = maxRankFrom;
    const decrement = (
      start: number,
      end: number,
      listId: number,
      taskId: number,
    ) => {
      this.taskRepository
        .createQueryBuilder()
        .update()
        .set({ rank: () => 'rank - 1' })
        .where('listId = :listId AND id <> :taskId', { listId, taskId })
        .andWhere('rank > :start AND rank <= :end', { start, end })
        .execute();
    };
    const increment = (
      start: number,
      end: number,
      listId: number,
      taskId: number,
    ) => {
      this.taskRepository
        .createQueryBuilder()
        .update()
        .set({ rank: () => 'rank + 1' })
        .where('listId = :listId AND id <> :taskId', { listId, taskId })
        .andWhere('rank >= :start AND rank < :end', { start, end })
        .execute();
    };

    if (listFromId === listToId) {
      if (rankFrom > rankTo) {
        increment(rankTo, rankFrom, listFromId, id);
      }
      if (rankFrom < rankTo) {
        decrement(rankFrom, rankTo, listFromId, id);
      }
    } else {
      const listTo = await this.checkAndGetParent(userId, dto.listId);
      const ranksTo = listTo.tasks.length
        ? listTo.tasks.map((t) => t.rank)
        : [0];
      maxRankTo = Math.max(...ranksTo) + 1;
      decrement(rankFrom, maxRankFrom, listFromId, id);
      increment(rankTo, maxRankTo, listToId, id);
      if (listTo.boardId !== task.list.boardId) {
        this.manager.delete(StrFieldValue, { task: id });
        this.manager.delete(NumFieldValue, { task: id });
        this.manager.delete(SelFieldValue, { task: id });
      }
      task.list = listTo;
    }

    task.listId = listToId;
    task.rank = Math.min(rankTo, maxRankTo);
    const result = { ...(await this.taskRepository.save(task)) };
    delete result.list;
    return result;
  }
}
