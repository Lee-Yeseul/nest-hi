import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDogProfileDto {
  @ApiProperty({ description: '프로필 이미지 경로', default: 'dog/test.png' })
  @IsString()
  imagePath: string;
}
