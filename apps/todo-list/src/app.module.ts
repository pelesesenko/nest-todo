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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
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
  ],
})
export class AppModule {}
