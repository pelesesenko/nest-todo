import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/guards';
import { ReqWithUser } from '@common/interfaces';
import { FieldDto } from './dto/field.dto';
import { FieldsService } from './fields.service';
import { UpdateFieldDto } from './dto/update-field.dto';

@ApiTags('Fields')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fields')
export class FieldsController {
  constructor(private fields: FieldsService) {}

  @Post()
  add(
    @Req() req: ReqWithUser,
    @Body(new ValidationPipe({ whitelist: true })) dto: FieldDto,
  ) {
    return this.fields.add(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req: ReqWithUser,
    @Param('id') fieldId: string,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateFieldDto,
  ) {
    return this.fields.update(req.user.id, Number(fieldId), dto);
  }

  @Delete(':id')
  delete(@Req() req: ReqWithUser, @Param('id') fieldId: string) {
    return this.fields.delete(req.user.id, Number(fieldId));
  }
}
