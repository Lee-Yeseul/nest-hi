import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MaxLength, IsIn } from 'class-validator';
import { dogBreeds } from 'src/constants/dogBreeds';

export class CreateDogDto {
  @ApiProperty({ description: '강아지 이름', default: '슈' })
  @MaxLength(8)
  @IsString()
  name: string;

  @ApiProperty({ description: '견종', default: '말티즈' })
  @IsString()
  @IsIn(Object.keys(dogBreeds))
  breed: keyof typeof dogBreeds;

  @ApiProperty({ description: '나이', default: 11 })
  @IsNumber()
  age: number;
}
