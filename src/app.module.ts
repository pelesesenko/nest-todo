import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { List } from './lists/list.entity';
import { Board } from './boards/board.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: true,
      entities: [User, Board, List, Task],
      subscribers: [],
      migrations: [],
    }),
    UsersModule,
    BoardsModule,
    ListsModule,
    TasksModule,
  ],
})
export class AppModule {}
