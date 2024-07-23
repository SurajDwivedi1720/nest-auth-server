import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcryptjs.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const sessionId = uuidv4();
    await this.usersService.updateSessionId(user.email, sessionId);

    const payload = { email: user.email, sub: user._id, sessionId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: any) {
    await this.usersService.updateSessionId(user.email, null);
  }
}
