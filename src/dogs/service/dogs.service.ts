import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DogRepository } from '../repository/dogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDogDto } from '../dto/createDogDto';
import { CreateDogProfileDto } from '../dto/createDogProfileDto';
import { UpdateDogDto } from '../dto/updateDogDto';
import { dogBreeds } from 'src/constants/dogBreeds';

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
      throw new BadRequestException('Dog already exists with this name');
    }
    return await this.dogRepository.createDog(createDogDto, ownerId);
  }

  async createDogProfile(
    id: number,
    createDogProfileDto: CreateDogProfileDto,
    ownerId: number,
  ) {
    const dog = await this.dogRepository.findOneBy({ id });
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    if (dog.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You are not authorized to create profile for this dog',
      );
    }
    return await this.dogRepository.saveDogProfile(id, createDogProfileDto);
  }

  async updateDog(id: number, updateDogDto: UpdateDogDto, userId: number) {
    const dog = await this.dogRepository.findOneBy({ id });
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    if (dog.ownerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this dog');
    }
    return await this.dogRepository.updateDog(id, updateDogDto);
  }

  async updateDogProfile(
    userId: number,
    id: number,
    updateDogDto: CreateDogProfileDto,
  ) {
    const dog = await this.dogRepository.findOneBy({ id });
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    if (dog.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update profile for this dog',
      );
    }
    return await this.dogRepository.saveDogProfile(id, updateDogDto);
  }

  async getDogs() {
    return await this.dogRepository.find();
  }

  async getMyDogs(userId: number) {
    return await this.dogRepository.find({ where: { ownerId: userId } });
  }

  async getDogById(id: number) {
    const dog = await this.dogRepository.findOneBy({ id });
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    return dog;
  }

  async getBreeds() {
    return { dogBreeds };
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
