import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      // console.log('333', req.headers);
      const [bearer, token] = req.headers.authorization.split(' ');
      if (bearer !== 'Bearer' || !token) {
        // console.log('1111');
        throw new UnauthorizedException('User is not authenticated');
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      // console.log('222', e);
      throw new UnauthorizedException('User is not authenticated');
    }
  }
}
