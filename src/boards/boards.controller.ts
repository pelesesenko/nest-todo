import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { ReqWithUser } from '../helpers/types';
import { BoardDto } from './dto/board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';

@ApiTags('Boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private boards: BoardsService) {}

  @Get()
  getAll(@Req() req: ReqWithUser) {
    return this.boards.getAll(req.user.id);
  }

  @Post()
  addOne(@Req() req: ReqWithUser, @Body() dto: BoardDto) {
    return this.boards.addOne(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') boardId: string,
    @Body() dto: BoardDto,
  ) {
    return this.boards.update(req.user.id, Number(boardId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') boardId: string) {
    return this.boards.delete(req.user.id, Number(boardId));
  }
}
