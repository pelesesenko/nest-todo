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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';
import { ListsService } from './lists.service';
import { ReqWithUser } from '../helpers/types';
import { ListDto } from './dto/list.dto';

@ApiTags('Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private lists: ListsService) {}

  @Get()
  getAllByBoard(@Req() req: ReqWithUser, @Query('board') boardId: string) {
    return this.lists.getAllByBoard(req.user.id, Number(boardId));
  }

  @Post()
  addOne(
    @Req() req: ReqWithUser,
    @Query('board') boardId: string,
    @Body() dto: ListDto,
  ) {
    return this.lists.addOne(req.user.id, Number(boardId), dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') listId: string,
    @Body() dto: ListDto,
  ) {
    return this.lists.update(req.user.id, Number(listId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') listId: string) {
    return this.lists.delete(req.user.id, Number(listId));
  }
}
