import { PartialType } from '@nestjs/swagger';
import { CreateWalkHistoryDto } from './createWalkHistoryDto';

export class UpdateWalkHistoryDto extends PartialType(CreateWalkHistoryDto) {}
