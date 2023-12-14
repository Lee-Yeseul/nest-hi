import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ description: '제목', default: '게시글 제목' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '내용', default: '게시글 내용' })
  @IsNotEmpty()
  description: string;
}
