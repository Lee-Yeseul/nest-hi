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

  @ApiProperty({ description: '비밀번호', default: '12345678' })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;

  @ApiProperty({ description: '비밀번호 확인', default: '12345678' })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  confirmPassword: string;
}
