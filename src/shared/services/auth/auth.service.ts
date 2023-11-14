import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/main/users/users.service';
import * as bcrypt from 'bcrypt';
import { BpmResponse } from 'src/main/index';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(username, pass) {
    if(!username) {
      return new BpmResponse(false, null, ['username is required'])
    }

    if(!pass) {
      return new BpmResponse(false, null, ['password is required'])
    }
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, merchantId: user.merchant['id'] };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET_KEY }),
    };
  }
}