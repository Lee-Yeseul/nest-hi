import { Module } from '@nestjs/common';
import { WalkHistoriesController } from './controller/walkHistories.controller';
import { WalkHistoriesService } from './service/walkHistories.service';
import { WalkHistoriesRepository } from './repository/walkHistory.repository';

@Module({
  controllers: [WalkHistoriesController],
  providers: [WalkHistoriesService, WalkHistoriesRepository],
})
export class WalkHistoriesModule {}
