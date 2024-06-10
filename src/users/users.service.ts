import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.repository.find();
  }

  getByIdOrFail(id: number): Promise<User | null> {
    return this.repository.findOneByOrFail({ id }); //trows 500 if no user
  }

  getByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  checkEmail(email: string) {
    return this.repository.existsBy({ email });
  }

  async addOne(data: CreateUserDto) {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async updateById(id: number, data: CreateUserDto) {
    const result = await this.repository.update(id, data);
    return result?.affected > 0 ? this.repository.findOneBy({ id }) : null;
  }

  async deleteById(id: number) {
    const result = await this.repository.delete(id);
    return result?.affected > 0;
  }
}
