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
import { DogsService } from '../service/dogs.service';
import { CreateDogDto } from '../dto/createDogDto';
import { GetUser } from 'src/user/decorator/getUser.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
import { CreateDogProfileDto } from '../dto/createDogProfileDto';
import { UpdateDogDto } from '../dto/updateDogDto';

@ApiTags('dogs')
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  async createDog(
    @Body(ValidationPipe) createDogDto: CreateDogDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id } = user;
    const result = await this.dogsService.createDog(createDogDto, id);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('/:id/profile')
  @UseGuards(AuthGuard('jwt'))
  async createDogProfile(
    @Param('id') id: number,
    @Body(ValidationPipe) createDogProfileDto: CreateDogProfileDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.dogsService.createDogProfile(
      id,
      createDogProfileDto,
      userId,
    );
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateDog(
    @Param('id') id: number,
    @Body(ValidationPipe) updateDogDto: UpdateDogDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.dogsService.updateDog(id, updateDogDto, userId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Put('/:id/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateDogProfile(
    @Param('id') id: number,
    @Body() updateDogDto: CreateDogProfileDto,
    @GetUser() user: User,
  ) {
    const { id: userId } = user;
    return await this.dogsService.updateDogProfile(userId, id, updateDogDto);
  }

  @Get('/list')
  async getDogs() {
    return await this.dogsService.getDogs();
  }

  @Get('/:id')
  async getDogById(@Param('id') id: number) {
    return await this.dogsService.getDogById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteDog(
    @Param('id') id: number,
    @GetUser() user: any,
    @Res() res: Response,
  ) {
    const { id: userId } = user;
    const result = await this.dogsService.deleteDog(id, userId);
    return res.status(HttpStatus.NO_CONTENT).json(result);
  }
}
