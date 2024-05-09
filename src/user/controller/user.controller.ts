import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { UpdateUserInfoDto } from '../dto/updateUserInfoDto';
import { UserService } from '../service/user.service';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  @Get('/user-info')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Res() res: Response, @Req() req) {
    const { user } = req;
    const result = await this.userService.getUserInfo(user.id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('/user-info')
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(
    @Res() res: Response,
    @Req() req,
    @Body(ValidationPipe) updateUserInfo: UpdateUserInfoDto,
  ) {
    const { user } = req;
    const result = await this.userService.updateUserInfo(
      updateUserInfo,
      user.id,
    );
    return res.status(HttpStatus.OK).json(result);
  }
}
