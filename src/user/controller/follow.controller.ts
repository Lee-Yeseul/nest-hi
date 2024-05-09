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
import { User } from '../entity/user.entity';
import { GetUser } from '../decorator/getUser.decorator';
import { FollowService } from '../service/follow.service';

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

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

  // 맞팔
  @Get('/mutual-followers')
  @UseGuards(AuthGuard('jwt'))
  async getMutualFollowers(@GetUser() user: User, @Res() res: Response) {
    const result = await this.followService.getMutualFollowers(user.id);
    return res.status(HttpStatus.CREATED).json(result);
  }

  // 나를 팔로우하는 사람들
  @Get('/followers')
  @UseGuards(AuthGuard('jwt'))
  async getFollowers(@GetUser() user: User, @Res() res: Response) {
    const result = await this.followService.getFollowers(user.id);
    return res.status(HttpStatus.CREATED).json(result);
  }

  // 내가 팔로우하는 사람들
  @Get('/followees')
  @UseGuards(AuthGuard('jwt'))
  async getFollowees(@GetUser() user: User, @Res() res: Response) {
    const result = await this.followService.getFollowees(user.id);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Patch('/:id/confirm')
  @UseGuards(AuthGuard('jwt'))
  async patchFollowConfirm(
    @Param('id') followerId: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    await this.followService.confirmFollow(followerId, user.id);
    await this.followService.followUser(followerId, user.id);
    await this.followService.confirmFollow(user.id, followerId);
    const result = { message: 'success' };
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteFollow(
    @Param('id') followerId: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.followService.deleteFollow(followerId, user.id);
    return res.status(HttpStatus.CREATED).json(result);
  }
}
