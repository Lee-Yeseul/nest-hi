import { DataSource, Repository } from 'typeorm';
import { Dog } from '../entity/dog.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDogDto } from '../dto/createDogDto';
import { CreateDogProfileDto } from '../dto/createDogProfileDto';
import { UpdateDogDto } from '../dto/updateDogDto';

@Injectable()
export class DogRepository extends Repository<Dog> {
  constructor(private dataSource: DataSource) {
    super(Dog, dataSource.createEntityManager());
  }

  async createDog(createDogDto: CreateDogDto, ownerId: number) {
    const { name, breed, age } = createDogDto;
    const dog = this.create({ name, breed, age, ownerId });
    try {
      await this.save(dog);
      const { id } = dog;
      return { id };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async saveDogProfile(id: number, createDogProfileDto: CreateDogProfileDto) {
    const { imagePath } = createDogProfileDto;
    try {
      await this.update({ id }, { imagePath });
      return { id };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async updateDog(id: number, updateDogDto: UpdateDogDto) {
    const { name, breed, age } = updateDogDto;
    try {
      await this.update({ id }, { name, breed, age });

      return { id };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
