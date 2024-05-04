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
import { CheckEmailUniqueDto } from '../dto/checkEmailUniqueDto';
import { CheckUsernameUniqueDto } from '../dto/checkUsernameDto';
import { UpdateUserInfoDto } from '../dto/updateUserInfoDto';
import { Not } from 'typeorm';
import { UserFollowersRepository } from '../repository/userFollowers.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserFollowersRepository)
    private readonly userFollowersRepository: UserFollowersRepository,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const isUniqueEmail = await this.checkEmailUnique({
        email: createUserDto.email,
      });
      const isUniqueUsername = await this.checkUsernameUnique({
        username: createUserDto.username,
      });

      if (!isUniqueEmail)
        throw new BadRequestException('Email is already in use');

      if (!isUniqueUsername)
        throw new BadRequestException('Username is already in use');

      return this.userRepository.createUser(createUserDto);
    } catch (err) {
      return err;
    }
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
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id };
    return await this.jwtService.signAsync(payload, {
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

  async checkEmailUnique(checkEmailUniqueDto: CheckEmailUniqueDto) {
    let isUnique = false;
    const { email } = checkEmailUniqueDto;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) isUnique = true;

    return isUnique;
  }

  async checkUsernameUnique(checkUsernameUnique: CheckUsernameUniqueDto) {
    let isUnique = false;
    const { username } = checkUsernameUnique;
    const user = await this.userRepository.findOneBy({ username });

    if (!user) isUnique = true;

    return isUnique;
  }

  async updateUserInfo(updateUserInfo: UpdateUserInfoDto, userId: number) {
    const { username, profileImagePath } = updateUserInfo;
    const existedUsername = await this.userRepository.findOne({
      where: { username: username, id: Not(userId) },
    });

    if (existedUsername)
      throw new BadRequestException('Username is already in use');

    await this.userRepository.update(userId, {
      username,
      profileImagePath,
    });
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

  async followUser(followeeId: number, followerId: number) {
    const result = await this.userFollowersRepository.save({
      follower: { id: followerId },
      followee: { id: followeeId },
    });
    return result;
  }

  async getFollowers(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        followee: { id: userId },
        isConfirmed: true,
      },
      relations: { follower: true, followee: true },
    });

    return result.map((x) => x.follower); // follower만 뽑아서 리스트만들기
  }

  async confirmFollow(followerId: number, followeeId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
      relations: { follower: true, followee: true },
    });

    if (!follow) throw new NotFoundException('not existing follow');

    await this.userFollowersRepository.update(follow.id, { isConfirmed: true });
    return true;
  }

  async deleteFollow(followerId: number, followeeId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });

    if (!follow) throw new NotFoundException('not existing follow');

    await this.userFollowersRepository.delete(follow.id);
    return true;
  }

  async kakaoLogin({ code }: { code: string }) {
    try {
      const grantType = 'authorization_code';
      const KAKAO_REST_API_KEY =
        this.configService.get<string>('KAKAO_REST_API_KEY');
      const KAKAO_REDIRECT_URL =
        this.configService.get<string>('KAKAO_REDIRECT_URL');
      const KAKAO_CLIENT_SECRET = this.configService.get<string>(
        'KAKAO_CLIENT_SECRET',
      );

      const { data } = await lastValueFrom(
        this.httpService
          .post(
            `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}&client_secret=${KAKAO_CLIENT_SECRET}`,
          )
          .pipe(map((res) => res)),
      );
      console.log('this', data);

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
      console.log(userInfo);

      const accessToken = await this.getAccessTokenByOAuth(
        userInfo.kakao_account.email,
      );

      return accessToken;
    } catch (error) {
      throw error.response.data;
    }
  }
}
