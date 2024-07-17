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
import { BoardsService } from './boards.service';
import { ReqWithUser } from '@common/interfaces';
import { BoardDto } from './dto/board.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@common/rmq';

@ApiTags('Boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(
    private boardsService: BoardsService,
    private rmqService: RmqService,
  ) {}

  @Get()
  @ApiQuery({ name: 'tree', required: false })
  @ApiQuery({ name: 'fields', required: false })
  getAll(
    @Req() req: ReqWithUser,
    @Query('tree') tree?: string | undefined,
    @Query('fields') fields?: string | undefined,
  ) {
    return this.boardsService.getAll(req.user.id, !!tree, !!fields);
  }

  @Get(':id')
  @ApiQuery({ name: 'tree', required: false })
  @ApiQuery({ name: 'fields', required: false })
  getById(
    @Req() req: ReqWithUser,
    @Param('id') boardId: string,
    @Query('tree') tree?: string | undefined,
    @Query('fields') fields?: string | undefined,
  ) {
    return this.boardsService.getById(
      req.user.id,
      Number(boardId),
      !!tree,
      !!fields,
    );
  }

  @Post()
  addOne(
    @Req() req: ReqWithUser,
    @Body(new ValidationPipe({ whitelist: true })) dto: BoardDto,
  ) {
    return this.boardsService.addOne(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') boardId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: BoardDto,
  ) {
    return this.boardsService.update(req.user.id, Number(boardId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') boardId: string) {
    return this.boardsService.delete(req.user.id, Number(boardId));
  }

  @MessagePattern('get_boards')
  getBoardIds(
    @Payload() data: [userId: number, withTree: boolean, withFields: boolean],
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.boardsService.getAll(...data);
  }

  @EventPattern('user_deleted')
  deletAllByUser(@Payload() userId: number, @Ctx() context: RmqContext) {
    this.boardsService.deleteAllByUser(userId);
    this.rmqService.ack(context);
  }
}
