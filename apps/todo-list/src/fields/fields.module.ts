import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { Field } from './field.entity';
import { JwtAuthModule } from '@common/jwt-auth';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), JwtAuthModule],
  providers: [FieldsService],
  controllers: [FieldsController],
})
export class FieldsModule {}
