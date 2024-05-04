import {
  Body,
  Controller,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { UpdateUserInfoDto } from '../dto/updateUserInfoDto';
import { UserService } from '../service/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Put('/user-info')
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(
    @Req() req,
    @Body(ValidationPipe) updateUserInfo: UpdateUserInfoDto,
  ) {
    const { user } = req;
    return this.userService.updateUserInfo(updateUserInfo, user.id);
  }
}
