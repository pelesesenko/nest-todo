import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginUserDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const exist = await this.usersService.checkEmail(dto.email);
    if (exist) {
      throw new BadRequestException('User with this email already exists');
    }
    const password = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.addOne({ ...dto, password });
    return this.generateToken(user);
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    return {
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      }),
    };
  }

  private async validateUser(dto: LoginUserDto) {
    const user = await this.usersService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return user;
  }
}
