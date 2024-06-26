import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTAccess } from './passport/jwtAccess.strategy';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTRefresh } from './passport/jwtRefresh.strategy';
import { UserFollowersRepository } from './repository/userFollowers.repository';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { FollowController } from './controller/follow.controller';
import { FollowService } from './service/follow.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: { expiresIn: configService.get<number>('JWT_EXPIRESIN') },
        signOptions: { expiresIn: 7200 },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
  ],
  controllers: [AuthController, UserController, FollowController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    FollowService,
    UserFollowersRepository,
    JWTAccess,
    JWTRefresh,
  ],
  exports: [JWTAccess, JWTRefresh, PassportModule],
})
export class UserModule {}
