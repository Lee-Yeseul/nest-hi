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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DogPostsService } from '../service/dogPosts.service';
import { CreateDogPostDto } from '../dto/createDogPostDto';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UpdateDogPostDto } from '../dto/updateDogPostDto';

@ApiTags('dog-posts')
@Controller('dog-posts')
export class DogPostsController {
  constructor(private readonly dogsService: DogPostsService) {}

  @ApiOperation({
    summary: '게시글 생성',
  })
  @ApiBody({ type: CreateDogPostDto })
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createDogPost(
    @Body(ValidationPipe) createDogPostDto: CreateDogPostDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id } = user;
    const result = await this.dogsService.createDogPost(createDogPostDto, id);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put('/:id')
  @ApiOperation({
    summary: '게시글 수정',
  })
  @ApiParam({ name: 'id', example: 1 })
  @UseGuards(AuthGuard('jwt'))
  async updateDogPost(
    @Param('id') id: number,
    @Body(ValidationPipe) updateDogPostDto: UpdateDogPostDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.dogsService.updateDogPost(
      id,
      updateDogPostDto,
      userId,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({
    summary: '게시글 전체 가져오기',
  })
  @Get()
  async getDogPosts() {
    return await this.dogsService.getDogPosts();
  }

  @ApiOperation({ summary: '유저 게시글 가져오기' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  async getDogPostsByUserId(@GetUser() user: User) {
    return await this.dogsService.getDogPostsByUserId(user.id);
  }

  @ApiOperation({
    summary: '게시글 하나 가져오기',
  })
  @ApiParam({ name: 'id', example: 1 })
  @Get('/:id')
  async getDogPostById(@Param('id') id: number) {
    return await this.dogsService.getDogPostById(id);
  }

  @ApiOperation({
    summary: '게시글 삭제',
  })
  @ApiParam({ name: 'id', example: 1 })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteDogPost(
    @Param('id') id: number,
    @GetUser() user: any,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.dogsService.deleteDogPost(id, userId);
    return res.status(HttpStatus.NO_CONTENT).json(result);
  }
}
