import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RMQ_USERS_SERVICE } from '@common/rmq';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @Inject(RMQ_USERS_SERVICE) private rmqUsersClient: ClientProxy,
  ) {}

  getAll(): Promise<User[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<User | null> {
    const result = await this.repository.findOneBy({ id });
    if (!result) throw new NotFoundException();
    return result;
  }

  // : Promise<{ user: User; boards: any } | null>
  async getSelf(id: number, withTree: boolean, withFields: boolean) {
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    const boards$ = this.rmqUsersClient
      .send('get_boards', [id, withTree, withFields])
      .pipe(timeout(5000));
    const boards = await lastValueFrom(boards$);
    return { user, boards };
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
    if (result?.affected === 0) return false;
    this.rmqUsersClient.emit('user_deleted', id);
    return true;
  }

  async setRoles(dto: SetUserRolesDto) {
    const result = await this.repository.update(dto.id, { roles: dto.roles });
    return result?.affected > 0 ? dto : false;
  }
}
