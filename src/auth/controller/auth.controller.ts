import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/createUserDto';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from '../dto/loginUserDto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '회원가입에 성공했습니다.' })
  @ApiResponse({ status: 404, description: '회원가입에 실패했습니다.' })
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          accesstoken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoieWVzZXVsIiwiaWF0IjoxNzAyNzM1MTUxLCJleHAiOjE3MDI3Mzg3NTF9.PnuzQ6AVh4xmZ4pL_U4xwA0GQNJit2SJNmTncihZOFw',
        },
      },
    },
  })
  @ApiUnauthorizedResponse()
  async signIn(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const user = await this.authService.validateUser(loginUserDto);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);
    await this.authService.setCurrentRefreshToken(refreshToken, user.id);

    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    return {
      message: 'login success',
      accessToken,
      refreshToken,
    };
  }

  @Post('/renew')
  @UseGuards(AuthGuard('refresh'))
  async renewAccessToken(@Req() req) {
    try {
      const { user } = req;
      const newAccessToken = await this.authService.generateAccessToken(user);
      return { newAccessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('invalid refresh token');
    }
  }

  @Post('/kakao-code')
  async kakaoLogin(
    @Body() code: { code: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.kakaoLogin(code);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'test', description: 'test 내용입니다.' })
  @UseGuards(AuthGuard())
  @Post('/test')
  async test() {
    console.log(this.configService.get<number>('JWT_EXPIRESIN'));
    return { message: 'success' };
  }
}
