import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DogRepository } from '../repository/dogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDogDto } from '../dto/createDogDto';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(DogRepository)
    private readonly dogRepository: DogRepository,
  ) {}

  async createDog(createDogDto: CreateDogDto, ownerId: number) {
    const { name } = createDogDto;
    const existingDog = await this.dogRepository.findOne({
      where: { ownerId, name },
    });
    if (existingDog) {
      throw new Error('Dog already exists with this name');
    }
    return await this.dogRepository.createDog(createDogDto, ownerId);
  }

  async getDogs() {
    return await this.dogRepository.find();
  }

  async getDogById(id: number) {
    const dog = await this.dogRepository.findOneBy({ id });
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    return dog;
  }

  async deleteDog(id: number, userId: number) {
    try {
      const dog = await this.getDogById(id);
      if (dog.ownerId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this dog',
        );
      }
      const result = await this.dogRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Dog not found');
      }
      return { message: 'Dog deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
