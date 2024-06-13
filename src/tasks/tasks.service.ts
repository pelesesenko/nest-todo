import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Task } from './task.entity';
import { List } from '../lists/list.entity';
import { TaskDto } from './dto/task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private manager: EntityManager,
  ) {}

  private listRepository = this.manager.getRepository(List);

  private async checkParent(userId: number, listId: number) {
    try {
      await this.listRepository.findOneByOrFail({ userId, id: listId });
    } catch {
      throw new BadRequestException(
        'List with this id does not exists or belongs to another user',
      );
    }
  }

  private async checkAndGetTask(
    userId: number,
    listId: number | undefined,
    taskId: number,
  ) {
    if (listId) await this.checkParent(userId, listId);
    try {
      return await this.taskRepository.findOneByOrFail({
        userId,
        id: taskId,
      });
    } catch {
      throw new BadRequestException(
        'Task with this id does not exists or belongs to another user',
      );
    }
  }

  async getAllByList(userId: number, listId: number) {
    await this.checkParent(userId, listId);
    return this.taskRepository.findBy({ listId });
  }

  getById(userId: number, id: number) {
    // const relations = withTree ? { tasks: true } : null;
    return this.taskRepository.findOne({ where: { userId, id } }); //, relations
  }

  async addOne(userId: number, listId: number, dto: TaskDto) {
    await this.checkParent(userId, listId);
    const rank =
      ((await this.taskRepository.maximum('rank', { listId })) || 0) + 1;
    const task = this.taskRepository.create({ ...dto, userId, listId, rank });
    return this.taskRepository.save(task);
  }

  async update(userId: number, id: number, data: TaskDto) {
    const result = await this.taskRepository.update({ userId, id }, data);
    return result?.affected > 0 ? this.taskRepository.findOneBy({ id }) : false;
  }

  async delete(userId: number, id: number) {
    const task = await this.checkAndGetTask(userId, undefined, id);
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

  async move(userId: number, id: number, dto: MoveTaskDto) {
    const task = await this.checkAndGetTask(userId, dto.listId, id);

    const rankFrom = task.rank;
    const rankTo = dto.rank;
    const listFrom = task.listId;
    const listTo = dto.listId;
    const maxRankFrom = await this.taskRepository.maximum('rank', {
      listId: listFrom,
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
      this.listRepository
        .createQueryBuilder()
        .update()
        .set({ rank: () => 'rank + 1' })
        .where('listId = :listId AND id <> :taskId', { listId, taskId })
        .andWhere('rank >= :start AND rank < :end', { start, end })
        .execute();
    };

    if (listFrom === listTo) {
      if (rankFrom > rankTo) {
        increment(rankTo, rankFrom, listFrom, id);
      }
      if (rankFrom < rankTo) {
        decrement(rankFrom, rankTo, listFrom, id);
      }
    } else {
      maxRankTo =
        (await this.taskRepository.maximum('rank', {
          listId: listTo,
        })) + 1;
      decrement(rankFrom, maxRankFrom, listFrom, id);
      increment(rankTo, maxRankTo, listTo, id);
    }

    task.listId = listTo;
    task.rank = Math.min(rankTo, maxRankTo);
    return this.taskRepository.save(task);
  }
}
