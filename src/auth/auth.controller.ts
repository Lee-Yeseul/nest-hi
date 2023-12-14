import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/getUser.decorator';
import { User } from './user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '사용자 정보를 추가합니다.',
  })
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({ status: 201, description: '회원가입에 성공했습니다.' })
  @ApiResponse({ status: 404, description: '회원가입에 실패했습니다.' })
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredentialDto);
  }

  @Post('/test')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'test', description: 'test 내용입니다.' })
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
