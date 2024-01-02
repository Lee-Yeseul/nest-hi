import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/loginUserDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.createUser(createUserDto);
  }

  async singIn(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) throw new NotFoundException();
      if (await bcrypt.compare(password, user.password)) {
        // 유저 토큰 생성 (Secret + Payload)
        const payload = { user: user.username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      Logger.log(`error ${error}`);
      throw error;
    }
  }
}
