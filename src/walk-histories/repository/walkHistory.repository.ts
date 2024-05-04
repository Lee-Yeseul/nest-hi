import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WalkHistory } from '../entity/walkHistory.entity';
import { CreateWalkHistoryDto } from '../dto/createWalkHistoryDto';
import { CreateWalkHistoryImageDto } from '../dto/createWalkHistoryImageDto';
import { UpdateWalkHistoryDto } from '../dto/updateWalkHistoryDto';

@Injectable()
export class WalkHistoriesRepository extends Repository<WalkHistory> {
  constructor(private dataSource: DataSource) {
    super(WalkHistory, dataSource.createEntityManager());
  }
  async createWalkHistory(
    userId: number,
    createWalkHistoryDto: CreateWalkHistoryDto,
  ) {
    const walkHistory = this.create({
      userId,
      ...createWalkHistoryDto,
    });
    await this.save(walkHistory);
    return walkHistory;
  }

  async saveWalkHistoryImage(
    id: number,
    createWalkHistoryImageDto: CreateWalkHistoryImageDto,
  ) {
    const { imagePath } = createWalkHistoryImageDto;
    try {
      await this.update({ id }, { imagePath });
      return 'profile created successfully';
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async updateWalkHistory(
    id: number,
    updateWalkHistoryDto: UpdateWalkHistoryDto,
  ) {
    const { oneLineComment, placeId } = updateWalkHistoryDto;
    try {
      await this.update({ id }, { oneLineComment, placeId });
      return 'walk history updated successfully';
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }
}
