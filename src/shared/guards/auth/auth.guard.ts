import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/main/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.url == '/api/v1/auth/login' || request.url == '/api/v1/merchant' || request.url.startsWith('/api/v1/merchant/id') || request.url.startsWith('/api/v1/currency') || request.url.startsWith('/api/v1/file') || request.url.startsWith('/api/v1/cargo/all-driver') || request.url.startsWith('/api/v1/cargo/id') || request.url.startsWith('/api/v1/users')) {
      return true;
    }
    let token = this.extractTokenFromHeader(request);
    if(request.url.startsWith('/sse/events')) {
    token = request.query.token
    }
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: 'jwt-merchant-secret-key'
        }
      );
      const user = await this.usersService.findUserByIot(payload.sub);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}