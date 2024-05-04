import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';

@Injectable()
export class JWTAccess extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { email } = payload;

    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('invalid access token');
    }
    return user;
  }
}
