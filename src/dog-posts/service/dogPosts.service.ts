import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DogPostRepository } from '../repository/dogPost.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDogPostDto } from '../dto/createDogPostDto';

@Injectable()
export class DogPostsService {
  constructor(
    @InjectRepository(DogPostRepository)
    private readonly dogPostRepository: DogPostRepository,
  ) {}

  async createDogPost(createDogPostDto: CreateDogPostDto, userId: number) {
    return await this.dogPostRepository.createDogPost(createDogPostDto, userId);
  }

  async getDogPosts() {
    return await this.dogPostRepository.find();
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
