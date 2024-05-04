import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWalkHistoryDto {
  @ApiProperty({ description: '산책 날짜', default: '2021-09-01' })
  @IsDate()
  date: Date;

  @ApiProperty({ description: '한 줄 코멘트', default: '좋은 날씨였어요' })
  @IsString()
  oneLineComment: string;

  @ApiProperty({ description: '산책장소 ID', default: 1 })
  @IsNumber()
  @IsOptional()
  placeId?: number;

  @ApiProperty({ description: '강아지 ID', default: 1 })
  @IsNumber()
  dogId: number;
}
