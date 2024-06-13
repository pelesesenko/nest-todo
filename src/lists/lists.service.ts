import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { EntityManager, Repository } from 'typeorm';
import { ListDto } from './dto/list.dto';
import { Board } from '../boards/board.entity';
import { MoveListDto } from './dto/move-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private manager: EntityManager,
  ) {}
  private boardRepository = this.manager.getRepository(Board);

  private async checkParent(userId: number, boardId: number) {
    try {
      await this.boardRepository.findOneByOrFail({ userId, id: boardId });
    } catch {
      throw new BadRequestException(
        'Board with this id does not exists or belongs to another user',
      );
    }
  }

  private async checkAndGetList(
    userId: number,
    boardId: number | undefined,
    listId: number,
  ) {
    if (boardId) await this.checkParent(userId, boardId);
    try {
      return await this.listRepository.findOneByOrFail({
        userId,
        id: listId,
      });
    } catch {
      throw new BadRequestException(
        'List with this id does not exists or belongs to another user',
      );
    }
  }

  async getAllByBoard(userId: number, boardId: number, withTree: boolean) {
    await this.checkParent(userId, boardId);
    const relations = withTree ? { tasks: true } : null;
    return this.listRepository.find({ where: { userId, boardId }, relations });
  }

  getById(userId: number, id: number, withTree: boolean) {
    const relations = withTree ? { tasks: true } : null;
    return this.listRepository.findOne({ where: { userId, id }, relations });
  }

  async addOne(userId: number, boardId: number, dto: ListDto) {
    await this.checkParent(userId, boardId);
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
    const list = await this.checkAndGetList(userId, undefined, id);
    const result = await this.listRepository.delete({ userId, id });
    return result?.affected > 0
      ? (this.listRepository
          .createQueryBuilder()
          .update()
          .set({ rank: () => 'rank - 1' })
          .where('boardId = :boardId', {
            boardId: list.boardId,
          })
          .andWhere('rank > :rank', { rank: list.rank })
          .execute(),
        true)
      : false;
  }

  async move(userId: number, id: number, dto: MoveListDto) {
    const list = await this.checkAndGetList(userId, dto.boardId, id);

    const rankFrom = list.rank;
    const rankTo = dto.rank;
    const boardFrom = list.boardId;
    const boardTo = dto.boardId;
    const maxRankFrom = await this.listRepository.maximum('rank', {
      boardId: boardFrom,
    });
    let maxRankTo = maxRankFrom;
    const decrement = (
      start: number,
      end: number,
      boardId: number,
      listId: number,
    ) => {
      this.listRepository
        .createQueryBuilder()
        .update()
        .set({ rank: () => 'rank - 1' })
        .where('boardId = :boardId AND id <> :listId', { boardId, listId })
        .andWhere('rank > :start AND rank <= :end', { start, end })
        .execute();
    };
    const increment = async (
      start: number,
      end: number,
      boardId: number,
      listId: number,
    ) => {
      const result = await this.listRepository
        .createQueryBuilder()
        .update()
        .set({ rank: () => 'rank + 1' })
        .where('boardId = :boardId AND id <> :listId', { boardId, listId })
        .andWhere('rank >= :start AND rank < :end', { start, end })
        .execute();
      console.log('increment', result);
    };

    if (boardFrom === boardTo) {
      if (rankFrom > rankTo) {
        increment(rankTo, rankFrom, boardFrom, id);
      }
      if (rankFrom < rankTo) {
        decrement(rankFrom, rankTo, boardFrom, id);
      }
    } else {
      maxRankTo =
        (await this.listRepository.maximum('rank', {
          boardId: boardTo,
        })) + 1;
      decrement(rankFrom, maxRankFrom, boardFrom, id);
      increment(rankTo, maxRankTo, boardTo, id);
    }

    list.boardId = boardTo;
    list.rank = Math.min(rankTo, maxRankTo);
    return this.listRepository.save(list);
  }
}
