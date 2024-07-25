import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService
        .get<string>('PUBLIC_KEY')
        .replace(/\\n/g, '\n'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
      sessionId: payload.sessionId,
      name: payload.name,
      id: payload.pas_user_id,
    };
  }
}
