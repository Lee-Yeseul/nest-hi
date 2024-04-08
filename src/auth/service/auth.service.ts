import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/createUserDto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/loginUserDto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { User } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.createUser(createUserDto);
  }

  async validateUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOneBy({ email });
      if (!user) throw new NotFoundException();
      if (!(await bcrypt.compare(password, user.password)))
        throw new BadRequestException('Invalid credentials');

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateAccessToken(user: User) {
    const payload = { user: user.username, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRESIN'),
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = await this.getCurrentRefreshToken(refreshToken);
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();

    await this.userRepository.update(userId, {
      localRefreshToken: currentRefreshToken,
      localRefreshTokenExp: currentRefreshTokenExp,
    });
  }

  async getCurrentRefreshToken(refreshToken: string) {
    const salt = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, salt);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp() {
    const currentDate = new Date();
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRESIN')),
    );

    return currentRefreshTokenExp;
  }

  async getAccessTokenByOAuth(email: string): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) throw new NotFoundException();

      // 유저 토큰 생성 (Secret + Payload)
      const payload = { user: user.username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async kakaoLogin({ code }: { code: string }) {
    const grantType = 'authorization_code';
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

    try {
      const { data } = await lastValueFrom(
        this.httpService
          .post(
            `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}&client_secret=${KAKAO_CLIENT_SECRET}`,
          )
          .pipe(map((res) => res)),
      );

      const { access_token, token_type } = data;

      const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
      const userInfoHeaders = {
        Authorization: `${token_type} ${access_token}`,
      };
      const { data: userInfo } = await lastValueFrom(
        this.httpService
          .get(userInfoUrl, {
            headers: userInfoHeaders,
          })
          .pipe(map((res) => res)),
      );

      const accessToken = await this.getAccessTokenByOAuth(
        userInfo.kakao_account.email,
      );

      return accessToken;
    } catch (error) {
      Logger.error(error.message);
      throw error.response.data;
    }
  }
}
