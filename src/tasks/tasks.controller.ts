import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ReqWithUser } from '../helpers/types';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto/task.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MoveTaskDto } from './dto/move-task.dto';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';
import { SetFieldValueDto } from './dto/set-field-value.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get()
  getAllByList(@Req() req: ReqWithUser, @Query('list') listId: string) {
    return this.tasks.getAllByList(req.user.id, Number(listId));
  }

  @Get(':id')
  @ApiQuery({ name: 'fields', required: false })
  getById(
    @Req() req: ReqWithUser,
    @Param('id') taskId: string,
    @Query('fields') fields?: string | undefined,
  ) {
    return this.tasks.getById(req.user.id, Number(taskId), !!fields);
  }

  @Post()
  addOne(
    @Req() req: ReqWithUser,
    @Body(new ValidationPipe({ whitelist: true })) dto: TaskDto,
  ) {
    return this.tasks.addOne(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') taskId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateTaskDto,
  ) {
    return this.tasks.update(req.user.id, Number(taskId), dto);
  }

  @Put(':id/set-field-value')
  setFieldValue(
    @Req() req: ReqWithUser,
    @Param('id') taskId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: SetFieldValueDto,
  ) {
    return this.tasks.setValue(req.user.id, Number(taskId), dto);
  }

  @Put(':id/move')
  move(
    @Req() req: ReqWithUser,
    @Param('id') taskId: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.tasks.move(req.user.id, Number(taskId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') taskId: string) {
    return this.tasks.delete(req.user.id, Number(taskId));
  }
}
