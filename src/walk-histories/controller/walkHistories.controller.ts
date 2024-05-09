import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalkHistoriesService } from '../service/walkHistories.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWalkHistoryDto } from '../dto/createWalkHistoryDto';
import { GetUser } from 'src/user/decorator/getUser.decorator';
import { User } from 'src/user/entity/user.entity';
import { CreateWalkHistoryImageDto } from '../dto/createWalkHistoryImageDto';
import { Response } from 'express';
import { UpdateWalkHistoryDto } from '../dto/updateWalkHistoryDto';

@ApiTags('walk-histories')
@Controller('walk-histories')
export class WalkHistoriesController {
  constructor(private readonly walkHistoriesService: WalkHistoriesService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  async createWalkHistory(
    @Body(ValidationPipe) createWalkHistoryDto: CreateWalkHistoryDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id } = user;
    const result = await this.walkHistoriesService.createWalkHistory(
      id,
      createWalkHistoryDto,
    );
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('/:id/image')
  @UseGuards(AuthGuard('jwt'))
  async createWalkHistoryImage(
    @Param('id') id: number,
    @Body(ValidationPipe) createWalkHistoryImage: CreateWalkHistoryImageDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.walkHistoriesService.createWalkHistoryImage(
      userId,
      id,
      createWalkHistoryImage,
    );
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateWalkHistory(
    @Param('id') id: number,
    @Body(ValidationPipe) updateWalkHistoryDto: UpdateWalkHistoryDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.walkHistoriesService.updateWalkHistory(
      userId,
      id,
      updateWalkHistoryDto,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('/:id/image')
  @UseGuards(AuthGuard('jwt'))
  async updateWalkHistoryImage(
    @Param('id') id: number,
    @Body() updateWalkHistoryImageDto: CreateWalkHistoryImageDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.walkHistoriesService.updateWalkHistoryImage(
      userId,
      id,
      updateWalkHistoryImageDto,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  async getWalkHistories(@GetUser() user: User, @Res() res: Response) {
    const result = await this.walkHistoriesService.getWalkHistories(user.id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getWalkHistoryById(
    @Param('id') id: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.walkHistoriesService.getWalkHistoryById(
      user.id,
      id,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteWalkHistory(
    @Param('id') id: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.walkHistoriesService.deleteWalkHistory(
      user.id,
      id,
    );
    return res.status(HttpStatus.NO_CONTENT).json(result);
  }
}
