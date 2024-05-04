import { Module } from '@nestjs/common';
import { DogPostsController } from './controller/dogPosts.controller';
import { DogPostsService } from './service/dogPosts.service';
import { DogPostRepository } from './repository/dogPost.repository';
import { DogsModule } from 'src/dogs/dogs.module';

@Module({
  imports: [DogsModule],
  controllers: [DogPostsController],
  providers: [DogPostsService, DogPostRepository],
})
export class DogPostsModule {}
