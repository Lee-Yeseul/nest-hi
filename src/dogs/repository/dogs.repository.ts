import { DataSource, Repository } from 'typeorm';
import { Dog } from '../entity/dog.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDogDto } from '../dto/createDogDto';

@Injectable()
export class DogRepository extends Repository<Dog> {
  constructor(private dataSource: DataSource) {
    super(Dog, dataSource.createEntityManager());
  }

  async createDog(createDogDto: CreateDogDto, ownerId: number): Promise<Dog> {
    const { name, breed, age } = createDogDto;
    const dog = this.create({ name, breed, age, ownerId });
    try {
      await this.save(dog);
      return dog;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
