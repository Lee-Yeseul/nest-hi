import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWalkHistoryImageDto {
  @ApiProperty({ description: '이미지 경로', default: '/test/test.png' })
  @IsString()
  imagePath: string;
}
