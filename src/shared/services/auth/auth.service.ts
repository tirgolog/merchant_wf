import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/main/users/users.service';
import * as bcrypt from 'bcrypt';
import { BpmResponse } from 'src/main/index';
import { HttpService } from "@nestjs/axios";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly httpService: HttpService
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
      return new BpmResponse(false, null, ['User not found'])
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user?.id, username: user.username, merchantId: user.merchant['id'] };
    const access_token = await this.jwtService.signAsync(payload, { secret: 'jwt-merchant-secret-key' })
    user.lastLogin = new Date();
    this.usersService.updateUser(user.id, user)
    return new BpmResponse(true,{ access_token: access_token}, null)

  }
}