import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { JwtAuthModule } from '@common/jwt-auth';
import { RmqModule } from '@common/rmq';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), JwtAuthModule, RmqModule],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class BoardsModule {}
