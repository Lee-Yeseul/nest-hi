import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({ description: '유저네임', default: '쓰리' })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  username?: string;

  @ApiProperty({
    description: '프로필 이미지 경로',
    default: '/profile/test.png',
  })
  @IsOptional()
  @IsString()
  profileImagePath?: string;
}
