import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<User | null> {
    const result = await this.repository.findOne({
      where: { id },
      relations: { boards: true },
    });
    if (!result) throw new NotFoundException();
    return result;
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

  async updateById(id: number, data: UpdateUserDto) {
    const result = await this.repository.update(id, data);
    return result?.affected > 0 ? this.repository.findOneBy({ id }) : false;
  }

  async deleteById(id: number) {
    const result = await this.repository.delete(id);
    return result?.affected > 0;
  }

  async setRoles(dto: SetUserRolesDto) {
    const result = await this.repository.update(dto.id, { roles: dto.roles });
    return result?.affected > 0 ? dto : false;
  }
}
