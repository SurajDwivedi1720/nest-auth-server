import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  IUserService,
  IUserWithoutPassword,
  IUser,
} from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    email: string,
    pass: string,
    userService: IUserService,
  ): Promise<IUserWithoutPassword | null> {
    const user = await userService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: IUserWithoutPassword, userService: IUserService) {
    await userService.updateSessionId(user.email, user.email);

    const payload = {
      email: user.email,
      sub: user.id,
      sessionId: user.email,
      name: user.name,
      pas_user_id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      name: user.name,
    };
  }

  async logout(user: IUser, userService: IUserService) {
    await userService.updateSessionId(user.email, null);
    return { success: true };
  }
}
