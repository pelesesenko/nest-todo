import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private repository: Repository<List>,
  ) {}
}
