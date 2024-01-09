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
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
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
      const {
        access_token,
        // expires_in,
        // refresh_token,
        // refresh_token_expires_in,
        token_type,
      } = data;
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

      const accessToken = this.getAccessTokenByOAuth(
        userInfo.kakao_account.email,
      );
      return accessToken;
    } catch (error) {
      Logger.error(error.message);
      throw error.response.data;
    }
  }

  async OAuthLogin({ req, res }) {
    console.log(req, res);
  }
}
