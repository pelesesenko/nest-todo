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

  @Get(':id')
  @ApiQuery({ name: 'tree', required: false })
  getById(
    @Req() req: ReqWithUser,
    @Param('id') boardId: string,
    @Query('tree') tree?: string | undefined,
  ) {
    return this.boards.getById(req.user.id, Number(boardId), !!tree);
  }

  @Post()
  addOne(
    @Req() req: ReqWithUser,
    @Body(new ValidationPipe({ whitelist: true })) dto: BoardDto,
  ) {
    return this.boards.addOne(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') boardId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: BoardDto,
  ) {
    return this.boards.update(req.user.id, Number(boardId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') boardId: string) {
    return this.boards.delete(req.user.id, Number(boardId));
  }
}
