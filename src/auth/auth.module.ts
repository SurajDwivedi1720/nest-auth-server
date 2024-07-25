import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService
          .get<string>('PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        publicKey: configService
          .get<string>('PUBLIC_KEY')
          .replace(/\\n/g, '\n'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '60m',
          issuer: 'NestAuthServer',
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
