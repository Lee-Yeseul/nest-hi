import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/getUser.decorator';
import { User } from './user.entity';
import { LoginUserDto } from './dto/loginUserDto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  signIn(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(loginUserDto);
  }

  @Post('/kakao-code')
  async kakaoLogin(@Body() code: { code: string }) {
    return this.authService.kakaoLogin(code);
  }

  @Post('/test')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'test', description: 'test 내용입니다.' })
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
