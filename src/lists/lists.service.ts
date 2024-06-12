import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { EntityManager, Repository } from 'typeorm';
import { ListDto } from './dto/list.dto';
import { Board } from '../boards/board.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private manager: EntityManager,
  ) {}
  private boardRepository = this.manager.getRepository(Board);

  private async checkAccess(
    userId: number,
    boardId: number | undefined,
    listId?: number,
  ) {
    try {
      if (boardId)
        await this.boardRepository.findOneByOrFail({ userId, id: boardId });
      if (listId)
        await this.listRepository.findOneByOrFail({ userId, id: listId });
    } catch {
      throw new BadRequestException(
        'Board with this id does not exists or belongs to another user',
      );
    }
  }

  async getAllByBoard(userId: number, boardId: number) {
    await this.checkAccess(userId, boardId);
    return this.listRepository.findBy({ boardId });
  }

  async addOne(userId: number, boardId: number, dto: ListDto) {
    await this.checkAccess(userId, boardId);
    const rank =
      ((await this.listRepository.maximum('rank', { boardId })) || 0) + 1;
    const list = this.listRepository.create({ ...dto, userId, boardId, rank });
    return this.listRepository.save(list);
  }

  async update(userId: number, id: number, data: ListDto) {
    const result = await this.listRepository.update({ userId, id }, data);
    return result?.affected > 0 ? this.listRepository.findOneBy({ id }) : false;
  }

  async delete(userId: number, id: number) {
    const result = await this.listRepository.delete({ userId, id });
    return result?.affected > 0;
  }
}
