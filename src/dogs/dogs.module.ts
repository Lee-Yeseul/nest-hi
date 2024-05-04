import { Module } from '@nestjs/common';
import { DogsService } from './service/dogs.service';
import { DogsController } from './controller/dogs.controller';
import { DogRepository } from './repository/dogs.repository';

@Module({
  providers: [DogsService, DogRepository],
  controllers: [DogsController],
  exports: [DogsService],
})
export class DogsModule {}
