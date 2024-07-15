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
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards';
import { ListsService } from './lists.service';
import { ReqWithUser } from '@common/interfaces';
import { ListDto } from './dto/list.dto';
import { MoveListDto } from './dto/move-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@ApiTags('Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private lists: ListsService) {}

  @Get()
  @ApiQuery({ name: 'tree', required: false })
  getAllByBoard(
    @Req() req: ReqWithUser,
    @Query('board') boardId: string,
    @Query('tree') tree: string,
  ) {
    return this.lists.getAllByBoard(req.user.id, Number(boardId), !!tree);
  }

  @Get(':id')
  @ApiQuery({ name: 'tree', required: false })
  getById(
    @Req() req: ReqWithUser,
    @Param('id') listId: string,
    @Query('tree') tree?: string | undefined,
  ) {
    return this.lists.getById(req.user.id, Number(listId), !!tree);
  }

  @Post()
  addOne(
    @Req() req: ReqWithUser,
    @Body(new ValidationPipe({ whitelist: true })) dto: ListDto,
  ) {
    return this.lists.addOne(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') listId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateListDto,
  ) {
    return this.lists.update(req.user.id, Number(listId), dto);
  }

  @Put(':id/move')
  move(
    @Req() req: ReqWithUser,
    @Param('id') listId: string,
    @Body() dto: MoveListDto,
  ) {
    return this.lists.move(req.user.id, Number(listId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') listId: string) {
    return this.lists.delete(req.user.id, Number(listId));
  }
}
