import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private repository: Repository<Board>,
  ) {}

  getAll(userId: number) {
    return this.repository.findBy({ userId });
  }

  async getById(userId: number, id: number, withTree: boolean) {
    const relations = withTree ? { lists: { tasks: true } } : null;
    const result = await this.repository.findOne({
      where: { userId, id },
      relations,
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async addOne(userId: number, dto: BoardDto) {
    const board = this.repository.create({ ...dto, userId });
    return this.repository.save(board);
  }

  async update(userId: number, id: number, data: BoardDto) {
    const result = await this.repository.update({ userId, id }, data);
    return result?.affected > 0 ? this.repository.findOneBy({ id }) : false;
  }

  async delete(userId: number, id: number) {
    const result = await this.repository.delete({ userId, id });
    return result?.affected > 0;
  }
}
