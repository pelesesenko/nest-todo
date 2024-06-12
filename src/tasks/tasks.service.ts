import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Task } from './task.entity';
import { List } from '../lists/list.entity';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private manager: EntityManager,
  ) {}

  private listRepository = this.manager.getRepository(List);

  private async checkAccess(
    userId: number,
    listId: number | undefined,
    taskId?: number,
  ) {
    try {
      if (listId)
        await this.listRepository.findOneByOrFail({ userId, id: listId });
      if (taskId)
        await this.taskRepository.findOneByOrFail({ userId, id: taskId });
    } catch {
      throw new BadRequestException(
        'Board with this id does not exists or belongs to another user',
      );
    }
  }

  async getAllByList(userId: number, listId: number) {
    await this.checkAccess(userId, listId);
    return this.taskRepository.findBy({ listId });
  }

  async addOne(userId: number, listId: number, dto: TaskDto) {
    await this.checkAccess(userId, listId);
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
    const result = await this.taskRepository.delete({ userId, id });
    return result?.affected > 0;
  }
}
