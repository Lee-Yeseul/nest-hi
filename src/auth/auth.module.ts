import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { JwtKakaoStrategy } from './jwtSocialKakao.strategy';
import { HttpModule } from '@nestjs/axios';

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy, JwtKakaoStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
