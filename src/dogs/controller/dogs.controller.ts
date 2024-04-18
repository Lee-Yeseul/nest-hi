import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DogsService } from '../service/dogs.service';
import { CreateDogDto } from '../dto/createDogDto';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entity/user.entity';
import { Response } from 'express';

@ApiTags('dogs')
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createDog(
    @Body(ValidationPipe) createDogDto: CreateDogDto,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const { id } = user;
    const result = await this.dogsService.createDog(createDogDto, id);
    return res.status(HttpStatus.CREATED).json(result);
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
