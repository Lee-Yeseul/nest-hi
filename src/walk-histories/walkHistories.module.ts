import { Module } from '@nestjs/common';
import { WalkHistoriesController } from './controller/walkHistories.controller';
import { WalkHistoriesService } from './service/walkHistories.service';

@Module({
  controllers: [WalkHistoriesController],
  providers: [WalkHistoriesService],
})
export class WalkHistoriesModule {}
