import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DogPost } from '../entity/dogPost.entity';
import { CreateDogPostDto } from '../dto/createDogPostDto';
import { UpdateDogPostDto } from '../dto/updateDogPostDto';

@Injectable()
export class DogPostRepository extends Repository<DogPost> {
  constructor(private dataSource: DataSource) {
    super(DogPost, dataSource.createEntityManager());
  }

  async createDogPost(createDogPostDto: CreateDogPostDto, userId: number) {
    try {
      const { title, content, tags, primaryActivityZone, dogId } =
        createDogPostDto;

      const post = this.create({
        dogId,
        title,
        content,
        tags,
        primaryActivityZone,
        authorId: userId,
      });

      await this.save(post);
      return { id: post.id };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async updateDogPost(id: number, updateDogPostDto: UpdateDogPostDto) {
    const { title, content, tags, primaryActivityZone, dogId } =
      updateDogPostDto;
    try {
      await this.update(
        { id },
        { title, content, tags, primaryActivityZone, dogId },
      );
      return { id: id };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
