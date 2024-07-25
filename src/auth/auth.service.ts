import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

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
    await this.usersService.updateSessionId(user.email, user.email);

    const payload = {
      email: user.email,
      sub: user._id,
      sessionId: user.email,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return {
      access_token: accessToken,
      name: user.name,
    };
  }

  async logout(user: any) {
    await this.usersService.updateSessionId(user.email, null);
    return { success: true };
  }
}
