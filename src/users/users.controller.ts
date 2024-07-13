import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';
import { ReqWithUser } from '../helpers/types';
import { SetUserRolesDto } from './dto/set-user-roles.dto';
import { Roles } from '../decorators/roles';
import { UserRoles } from './user.entity';
import { RolesGuard } from '../helpers/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './responses';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('self')
  async getSelf(@Req() req: ReqWithUser) {
    const user = await this.usersService.getById(req.user.id);
    return new UserResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('self')
  async updateSelf(@Body() dto: UpdateUserDto, @Req() req: ReqWithUser) {
    const user = await this.usersService.updateById(req.user.id, dto);
    return new UserResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('self')
  deleteSelf(@Req() req: ReqWithUser) {
    return this.usersService.deleteById(req.user.id);
  }

  @Roles(UserRoles.ADMIN)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Roles(UserRoles.ADMIN)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(Number(id));
  }

  @Roles(UserRoles.ADMIN)
  @Put('roles')
  setRoles(@Body() dto: SetUserRolesDto) {
    return this.usersService.setRoles(dto);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteById(Number(id));
  }
}
