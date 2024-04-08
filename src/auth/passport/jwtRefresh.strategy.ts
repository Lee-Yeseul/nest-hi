import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';

import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JWTRefresh extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request.cookies.refresh_token;
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const { refresh_token } = req.cookies;
    const { id } = payload;

    const user: User = await this.userRepository.findOneBy({ id });
    const now = new Date();

    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (now.getTime() > user.localRefreshTokenExp.getTime()) {
      throw new UnauthorizedException('refresh token has expired');
    }
    if (!(await bcrypt.compare(refresh_token, user.localRefreshToken))) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return user;
  }
}
