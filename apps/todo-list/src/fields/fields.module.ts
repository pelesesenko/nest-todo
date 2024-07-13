import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { Field } from './field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), AuthModule],
  providers: [FieldsService],
  controllers: [FieldsController],
})
export class FieldsModule {}
