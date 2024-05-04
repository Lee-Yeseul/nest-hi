import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DogPostRepository } from '../repository/dogPost.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDogPostDto } from '../dto/createDogPostDto';
import { UpdateDogPostDto } from '../dto/updateDogPostDto';
import { DogsService } from 'src/dogs/service/dogs.service';

@Injectable()
export class DogPostsService {
  constructor(
    @InjectRepository(DogPostRepository)
    private readonly dogPostRepository: DogPostRepository,
    private readonly dogsService: DogsService,
  ) {}

  async checkDogOwnership(dogId: number, userId: number) {
    const dog = await this.dogsService.getDogById(dogId);

    if (!dog) {
      throw new NotFoundException('Dog not found');
    }

    if (dog.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to create post for this dog',
      );
    }
    return dog;
  }
  async createDogPost(createDogPostDto: CreateDogPostDto, userId: number) {
    const { dogId } = createDogPostDto;
    await this.checkDogOwnership(dogId, userId);
    return await this.dogPostRepository.createDogPost(createDogPostDto, userId);
  }

  async updateDogPost(
    id: number,
    updateDogPostDto: UpdateDogPostDto,
    userId: number,
  ) {
    const { dogId } = updateDogPostDto;
    const dogPost = await this.dogPostRepository.findOneBy({ id });
    if (!dogPost) {
      throw new NotFoundException('Dog post not found');
    }

    if (dogPost.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }

    await this.checkDogOwnership(dogId, userId);

    return await this.dogPostRepository.updateDogPost(id, updateDogPostDto);
  }

  async getDogPosts() {
    return await this.dogPostRepository.find();
  }

  async getDogPostsByUserId(userId: number) {
    return await this.dogPostRepository.find({ where: { authorId: userId } });
  }

  async getDogPostById(id: number) {
    try {
      const post = await this.dogPostRepository.findOneBy({ id });
      if (!post) {
        throw new NotFoundException('Dog post not found');
      }
      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteDogPost(id: number, userId: number) {
    try {
      const post = await this.dogPostRepository.findOneBy({ id });

      if (!post) {
        throw new NotFoundException('Dog post not found');
      }

      if (post.authorId !== userId) {
        throw new Error('You are not authorized to delete this post');
      }

      await this.dogPostRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
