import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { List } from './lists/list.entity';
import { Board } from './boards/board.entity';
import { Field } from './fields/field.entity';
import { FieldsModule } from './fields/fields.module';
import { StrFieldValue } from './tasks/str-field-value.entity';
import { NumFieldValue } from './tasks/num-field-values.entity';
import { SelFieldValue } from './tasks/sel-field-value.entity';
import { RmqModule } from '../../../libs/common/src/rmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './apps/todo/.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_TODO_HOST,
      port: Number(process.env.POSTGRES_TODO_PORT),
      username: process.env.POSTGRES_TODO_USER,
      password: process.env.POSTGRES_TODO_PASSWORD,
      database: process.env.POSTGRES_TODO_DB,
      synchronize: true,
      logging: true,
      entities: [
        Board,
        List,
        Task,
        Field,
        StrFieldValue,
        NumFieldValue,
        SelFieldValue,
      ],
      subscribers: [],
      migrations: [],
    }),
    BoardsModule,
    ListsModule,
    TasksModule,
    FieldsModule,
    RmqModule,
  ],
})
export class AppModule {}
