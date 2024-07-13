import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { EntityManager, Repository } from 'typeorm';
import { ListDto } from './dto/list.dto';
import { Board } from '../boards/board.entity';
import { MoveListDto } from './dto/move-list.dto';
import { NumFieldValue } from '../tasks/num-field-values.entity';
import { SelFieldValue } from '../tasks/sel-field-value.entity';
import { StrFieldValue } from '../tasks/str-field-value.entity';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private manager: EntityManager,
  ) {}
  private boardRepository = this.manager.getRepository(Board);

  private async checkAndGetParent(userId: number, boardId: number) {
    try {
      return await this.boardRepository.findOneOrFail({
        where: {
          userId,
          id: boardId,
        },
        relations: { lists: true },
      });
    } catch {
      throw new BadRequestException(
        'Board with this id does not exists or belongs to another user',
      );
    }
  }

  private async checkAndGetList(
    userId: number,
    listId: number,
    boardId?: number,
  ) {
    if (boardId) await this.checkAndGetParent(userId, boardId);
    try {
      return await this.listRepository.findOneOrFail({
        where: {
          userId,
          id: listId,
        },
        relations: { tasks: true },
      });
    } catch {
      throw new BadRequestException(
        'List with this id does not exists or belongs to another user',
      );
    }
  }

  async getAllByBoard(userId: number, boardId: number, withTree: boolean) {
    await this.checkAndGetParent(userId, boardId);
    const relations = withTree ? { tasks: true } : null;
    return this.listRepository.find({ where: { userId, boardId }, relations });
  }

  async getById(userId: number, id: number, withTree: boolean) {
    const relations = withTree ? { tasks: true } : null;
    const result = await this.listRepository.findOne({
      where: { userId, id },
      relations,
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async addOne(userId: number, dto: ListDto) {
    await this.checkAndGetParent(userId, dto.boardId);
    const rank =
      ((await this.listRepository.maximum('rank', { boardId: dto.boardId })) ||
        0) + 1;
    const list = this.listRepository.create({ ...dto, userId, rank });
    return this.listRepository.save(list);
  }

  async update(userId: number, id: number, data: UpdateListDto) {
    const result = await this.listRepository.update({ userId, id }, data);
    return result?.affected > 0 ? this.listRepository.findOneBy({ id }) : false;
  }

  async delete(userId: number, id: number) {
    const list = await this.checkAndGetList(userId, id);
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
    const list = await this.checkAndGetList(userId, id, dto.boardId);

    const rankFrom = list.rank;
    const rankTo = dto.rank;
    const boardFromId = list.boardId;
    const boardToId = dto.boardId;
    const { max: maxRankFrom } = await this.listRepository
      .createQueryBuilder('list')
      .select('MAX(list.rank)', 'max')
      .where('list.boardId = :boardId', { boardId: boardFromId })
      .getRawOne();
    // const maxRankFrom = await this.listRepository.maximum('rank', {
    //   boardId: boardFromId,
    // });
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
    const increment = (
      start: number,
      end: number,
      boardId: number,
      listId: number,
    ) => {
      this.listRepository
        .createQueryBuilder()
        .update()
        .set({ rank: () => 'rank + 1' })
        .where('boardId = :boardId AND id <> :listId', { boardId, listId })
        .andWhere('rank >= :start AND rank < :end', { start, end })
        .execute();
    };

    if (boardFromId === boardToId) {
      if (rankFrom > rankTo) {
        increment(rankTo, rankFrom, boardFromId, id);
      }
      if (rankFrom < rankTo) {
        decrement(rankFrom, rankTo, boardFromId, id);
      }
    } else {
      const boardTo = await this.checkAndGetParent(userId, boardToId);
      const ranksTo = boardTo.lists.length
        ? boardTo.lists.map((l) => l.rank)
        : [0];
      maxRankTo = Math.max(...ranksTo) + 1;
      decrement(rankFrom, maxRankFrom, boardFromId, id);
      increment(rankTo, maxRankTo, boardToId, id);
      list.board = boardTo;
      list.tasks.forEach((t) => {
        this.manager.delete(StrFieldValue, { task: t.id });
        this.manager.delete(NumFieldValue, { task: t.id });
        this.manager.delete(SelFieldValue, { task: t.id });
      });
    }

    list.boardId = boardToId;
    list.rank = Math.min(rankTo, maxRankTo);
    const result = { ...(await this.listRepository.save(list)) };
    delete result.board;
    delete result.tasks;
    return result;
  }
}
