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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MoveTaskDto } from './dto/move-task.dto';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';

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
  // @ApiQuery({ name: 'tree', required: false })
  getById(
    @Req() req: ReqWithUser,
    @Param('id') listId: string,
    // @Query('tree') tree?: string | undefined,
  ) {
    return this.tasks.getById(req.user.id, Number(listId)); //, !!tree
  }

  @Post()
  addOne(
    @Req() req: ReqWithUser,
    @Query('list') listId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: TaskDto,
  ) {
    return this.tasks.addOne(req.user.id, Number(listId), dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') taskId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: TaskDto,
  ) {
    return this.tasks.update(req.user.id, Number(taskId), dto);
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
