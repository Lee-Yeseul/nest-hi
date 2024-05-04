import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalkHistoriesRepository } from '../repository/walkHistory.repository';
import { CreateWalkHistoryDto } from '../dto/createWalkHistoryDto';
import { CreateWalkHistoryImageDto } from '../dto/createWalkHistoryImageDto';
import { UpdateWalkHistoryDto } from '../dto/updateWalkHistoryDto';

@Injectable()
export class WalkHistoriesService {
  constructor(
    @InjectRepository(WalkHistoriesRepository)
    private readonly walkHistoriesRepository: WalkHistoriesRepository,
  ) {}

  async createWalkHistory(
    userId: number,
    createWalkHistoryDto: CreateWalkHistoryDto,
  ) {
    const { date } = createWalkHistoryDto;
    const isToday = new Date(date).toDateString() === new Date().toDateString();

    const isExisting = await this.walkHistoriesRepository.findOneBy({
      date,
      userId,
    });

    if (isExisting) {
      throw new BadRequestException('Walk history already exists');
    }

    if (!isToday) {
      throw new BadRequestException(
        'Walk history can only be created for today',
      );
    }
    return await this.walkHistoriesRepository.createWalkHistory(
      userId,
      createWalkHistoryDto,
    );
  }

  async createWalkHistoryImage(
    userId: number,
    id: number,
    createWalkHistoryImage: CreateWalkHistoryImageDto,
  ) {
    const walkHistory = await this.walkHistoriesRepository.findOneBy({
      id,
      userId,
    });

    if (!walkHistory) {
      throw new BadRequestException('Walk history not found');
    }

    if (walkHistory.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to add image to this walk history',
      );
    }

    return await this.walkHistoriesRepository.saveWalkHistoryImage(
      id,
      createWalkHistoryImage,
    );
  }

  async updateWalkHistory(
    userId: number,
    id: number,
    updateWalkHistoryDto: UpdateWalkHistoryDto,
  ) {
    const walkHistory = await this.walkHistoriesRepository.findOneBy({
      id,
      userId,
    });

    if (!walkHistory) {
      throw new BadRequestException('Walk history not found');
    }

    if (walkHistory.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this walk history',
      );
    }

    return await this.walkHistoriesRepository.updateWalkHistory(
      id,
      updateWalkHistoryDto,
    );
  }

  async updateWalkHistoryImage(
    userId: number,
    id: number,
    updateWalkHistoryImageDto: CreateWalkHistoryImageDto,
  ) {
    const walkHistory = await this.walkHistoriesRepository.findOneBy({
      id,
      userId,
    });

    if (!walkHistory) {
      throw new BadRequestException('Walk history not found');
    }

    if (walkHistory.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update image for this walk history',
      );
    }

    return await this.walkHistoriesRepository.saveWalkHistoryImage(
      id,
      updateWalkHistoryImageDto,
    );
  }

  async getWalkHistories(userId: number) {
    return await this.walkHistoriesRepository.find({ where: { userId } });
  }

  async getWalkHistoryById(userId: number, id: number) {
    const walkHistory = await this.walkHistoriesRepository.findOneBy({
      id,
      userId,
    });
    console.log(walkHistory);

    if (!walkHistory) {
      throw new BadRequestException('Walk history not found');
    }

    return walkHistory;
  }

  async deleteWalkHistory(userId: number, id: number) {
    const walkHistory = await this.walkHistoriesRepository.findOneBy({
      id,
      userId,
    });

    if (!walkHistory) {
      throw new BadRequestException('Walk history not found');
    }

    if (walkHistory.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this walk history',
      );
    }

    await this.walkHistoriesRepository.delete(id);
    return 'walk history deleted successfully';
  }
}
