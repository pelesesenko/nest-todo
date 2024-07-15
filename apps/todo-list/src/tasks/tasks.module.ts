import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { JwtAuthModule } from '@common/jwt-auth';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), JwtAuthModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
