import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthModule } from '../../../../libs/common/src/jwt-auth';
import { RMQ_USERS_SERVICE, RmqModule } from '@common/rmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    JwtAuthModule,
    RmqModule.register({
      name: RMQ_USERS_SERVICE,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
