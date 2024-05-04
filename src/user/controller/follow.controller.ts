import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { GetUser } from '../decorator/getUser.decorator';
import { FollowService } from '../service/follow.service';

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/:id')
  @UseGuards(AuthGuard('jwt'))
  async postFollow(
    @Param('id') followeeId: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.followService.followUser(followeeId, user.id);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getFollowers(@GetUser() user: User) {
    return await this.followService.getFollowers(user.id);
  }

  @Patch('/:id/confirm')
  @UseGuards(AuthGuard('jwt'))
  async patchFollowConfirm(
    @Param('id') followerId: number,
    @GetUser() user: User,
  ) {
    await this.followService.confirmFollow(followerId, user.id);
    await this.followService.followUser(followerId, user.id);
    await this.followService.confirmFollow(user.id, followerId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteFollow(@Param('id') followerId: number, @GetUser() user: User) {
    await this.followService.deleteFollow(followerId, user.id);
  }
}
