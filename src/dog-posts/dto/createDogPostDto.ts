import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateDogPostDto {
  @ApiProperty({ description: '강아지 id', default: 1 })
  @IsNumber()
  dogId: number;

  @ApiProperty({ description: '글 제목', default: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '글 내용', default: '내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'tags', default: ['물어요', '귀요미'] })
  @IsArray()
  @ArrayMaxSize(5)
  tags?: string[];

  @ApiProperty({ description: '주 활동 영역', default: '도봉구 방학동' })
  @IsString()
  primaryActivityZone?: string;
}
