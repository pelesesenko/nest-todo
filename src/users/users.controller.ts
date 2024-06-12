import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ReqWithUser } from '../helpers/types';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get() // for admins. todo: add roles
  getAll() {
    return this.usersService.getAll();
  }

  // todo: add endpoint for getting user with entities tree by id from token

  @Get(':id') // for admins. todo: add roles
  getById(@Param('id') id: string) {
    return this.usersService.getByIdOrFail(Number(id));
  }

  @Put()
  update(@Body() dto: CreateUserDto, @Req() req: ReqWithUser) {
    return this.usersService.updateById(req.user.id, dto);
  }

  @Delete()
  delete(@Req() req: ReqWithUser) {
    return this.usersService.deleteById(req.user.id);
  }
}
