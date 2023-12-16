import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '이메일', default: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '유저이름', default: 'test' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  username: string;

  @ApiProperty({ description: '비밀번호', default: '12345678' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;
}
